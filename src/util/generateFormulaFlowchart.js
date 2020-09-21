'use strict';
const {
  contains,
  append,
  find,
  propEq,
  pipe,
  filter,
  forEach,
  max,
  join,
  isNil,
  concat,
  toLower,
  T,
  reduce,
  equals,
  chain,
  toUpper,
  keys,
  length,
  cond,
  replace,
  forEachObjIndexed,
  map,
} = require('ramda');
const {writeFileSync} = require('fs');
const {htmlFormulaTemplate} = require('./mermaidTemplate');
const align = require('./stringAlign');

const sortSteps = (trigger, steps) => {
  try {
    let sortedSteps = [];
    const addSteps = (toAdd) => {
      forEach((s) => {
        if (!contains(s, sortedSteps)) {
          sortedSteps.push(s);
        }
      })(toAdd);
    };

    const getStep = (name) => find(propEq('name', name))(steps);
    let stepsToAdd = !isNil(trigger) ? concat(trigger.onSuccess, trigger.onFailure) : [];
    addSteps(stepsToAdd);
    //Go through sorted steps, cnt is pointer to current step name
    let cnt = 0;
    while (length(sortedSteps) != cnt) {
      //Get step JSON from Steps
      let step = getStep(sortedSteps[cnt]);
      stepsToAdd = concat(step.onSuccess, step.onFailure);
      addSteps(stepsToAdd);
      cnt += 1;
    }
    //using sorted step names create full step array
    return map(getStep)(sortedSteps);
  } catch (error) {
    throw error;
  }
};

const objectToPrintOut = (object) => {
  const maxChars = reduce(max, 0, map(length)(keys(object))) + 2;

  return join(
    '<br>',
    map((k) => `${align(k, maxChars, 'right')} : ${object[k].toString().replace('"', "'")}`)(keys(object)),
  );
};

const parseTrigger = (triggerStep) => {
  if (isNil(triggerStep)) {
    return {};
  }
  const triggerProperties = {
    ...triggerStep.properties,
    type: triggerStep.type,
    async: triggerStep.async,
  };
  const tipText = objectToPrintOut(triggerProperties);
  const tipLabel = 'Trigger Element';
  return {
    name: 'trigger',
    label: 'Trigger',
    links: [
      {
        text: 'continue',
        dest: triggerStep.onSuccess[0],
        line: '== {link_label} ==>',
      },
    ],
    type: 'trigger',
    json: JSON.stringify(triggerStep, null, 2),
    tip_text: {
      label: tipLabel,
      text: tipText,
    },
    shape: '(({name}))',
    shape_style: undefined,
    click_url: encodeURLData(triggerStep, tipText, tipLabel),
  };
};

const parseStep = (step) => {
  const rtnSteps = [];
  const tipText = generateTipText(step);
  const rtnStep = {
    name: step.name,
    label: step.name.replace('(', '*').replace(')', '*'),
    type: step.type,
    json: JSON.stringify(step, null, 2),
    links: [],
    shape: getShape(step.type),
    shape_style: undefined,
    tip_text: tipText,
  };
  rtnStep['click_url'] = encodeURLData(step, tipText.text, tipText.label);
  if (length(step.onSuccess) > 0) {
    rtnStep.links = append(
      {
        text: 'success',
        dest: step.onSuccess[0],
        line: '-- {link_label} -->',
      },
      rtnStep.links,
    );
  }
  if (length(step.onFailure) > 0) {
    rtnStep.links = append(
      {
        text: 'failure',
        dest: step.onFailure[0],
        line: '-- {link_label} -->',
      },
      rtnStep.links,
    );
  }
  //If success and fail are the same overwrite with continue
  if (length(step.onSuccess) > 0 && length(step.onFailure) > 0 && step.onSuccess[0] === step.onFailure[0]) {
    rtnStep.links = [
      {
        text: 'continue',
        dest: step.onSuccess[0],
        line: '== {link_label} ==>',
      },
    ];
  }

  if (step.type === 'elementRequest' || step.type === 'request') {
    rtnStep['shape_style'] = getShapeStyle(step.properties['method']);
  }

  rtnSteps.push(rtnStep);

  //Check if there is no continuation or only one for filters and loops
  if (length(step.onSuccess) === 0 && length(step.onFailure) === 0) {
    const endStep = {
      name: 'END',
      label: 'END',
      type: 'end',
      json: '',
      links: [],
      shape: getShape('end'),
      shape_style: getShapeStyle('generated'),
      click_url: undefined,
      tip_text: undefined,
    };
    rtnSteps.push(endStep);
    rtnStep.links = [{text: 'done', dest: 'END', line: '-. {link_label} .->'}];
  }

  if (step.type === 'filter' && length(rtnStep.links) === 1) {
    const endStep = {
      name: `END-${step.name}-END`,
      label: 'END',
      type: 'end',
      json: '',
      links: [],
      shape: getShape('end'),
      shape_style: getShapeStyle('generated'),
      click_url: undefined,
      tip_text: undefined,
    };
    if (rtnStep.links[0].text === 'success') {
      rtnSteps.push(endStep);
      rtnStep.links.push({
        text: 'failure',
        dest: `END-${step.name}-END`,
        line: '-. {link_label} .->',
      });
    } else if (rtnStep.links[0].text === 'failure') {
      rtnSteps.push(endStep);
      rtnStep.links.push({
        text: 'success',
        dest: `END-${step.name}-END`,
        line: '-. {link_label} .->',
      });
    }
  }

  return rtnSteps;
};

const getShape = pipe(
  toLower,
  cond([
    [(type) => equals(type, 'trigger') || equals(type, 'end'), () => '(({name}))'],
    [equals('filter'), () => '{{name}}'],
    [equals('loop'), () => '(-{name}-)'],
    [(type) => equals(type, 'elementrequest') || equals(type, 'request'), () => '>{name}]'],
    [equals('script'), () => '({name})'],
    [T, () => '[{name}]'],
  ]),
);

const getShapeStyle = pipe(
  toUpper,
  cond([
    [equals('GENERATED'), () => `style {name} stroke-width:3px,stroke-dasharray: 5, 5;`],
    [equals('WORMHOLE'), () => `style {name} fill:#dda7f9,stroke-width:3px,stroke-dasharray: 5, 5;`],
    [equals('GET'), () => `style {name} stroke:#0f6ab4;`],
    [equals('POST'), () => `style {name} stroke:#10a54a;`],
    [equals('PATCH'), () => `style {name} stroke:#D38042;`],
    [equals('PUT'), () => `style {name} stroke:#C5862B;`],
    [equals('DELETE'), () => `style {name} stroke:#a41e22;`],
  ]),
);

const generateTipText = cond([
  [
    (s) => equals(s.type, 'script') || equals(s.type, 'filter'),
    (s) => ({label: 'JavaScript', text: jsTipText(s.properties['body'])}),
  ],
  [propEq('type', 'elementRequest'), (s) => ({label: 'Request', text: objectToPrintOut(s.properties)})],
  [propEq('type', 'loop'), (s) => ({label: 'Loop', text: objectToPrintOut(s.properties)})],
  [T, (s) => ({label: `Other (${s.type})`, text: objectToPrintOut(s.properties)})],
]);

const encodeURLData = (stepJson, tipText, tipLabel) => {
  const toEncode = `<b>${tipLabel}:</b><br><br><pre>${tipText}</pre><br><b>RAW JSON:</b><br><br><pre>${jsTipText(
    JSON.stringify(stepJson, null, 2),
  )}</pre>`;
  const toEncode2 = `<html><head><title>${stepJson.name}</title></head><body>${toEncode}</body></html>`;
  return `javascript:document.open();document.write(window.atob('${Buffer.from(toEncode2).toString(
    'base64',
  )}'));document.close();`;
};

const jsTipText = pipe(
  replace(/</g, '|thisIsALessThanSign|'),
  replace(/>/g, '|thisIsAGreaterThanSign|'),
  replace(/\|thisIsALessThanSign\|/g, '<span><</span>'),
  replace(/\|thisIsAGreaterThanSign\|/g, '<span>></span>'),
  replace(/\\n/g, '|ThisIsNotTheNewLineYouAreLookingFor|'),
  replace(/\n/g, '<br>'),
  replace(/"/g, "'"),
  replace(/\|ThisIsNotTheNewLineYouAreLookingFor\|/g, '\\n'),
);

const lpad = (value, padding) => {
  var zeroes = new Array(padding + 1).join('0');
  return (zeroes + value).slice(-padding);
};

const generateMermaidNodes = (steps, stepNameMapping) =>
  join(
    '',
    map((step) => `            ${stepNameMapping[step.name]}${step.shape.replace('{name}', step.label)}\n`)(steps),
  );

const generateMermaidLinks = (steps, stepNameMapping) =>
  join(
    '',
    chain((s) =>
      map(
        (l) =>
          `            ${stepNameMapping[s.name]}${l.line.replace('{link_label}', l.text)}${stepNameMapping[l.dest]}\n`,
      )(s.links),
    )(steps),
  );

const generateMermaidNodeStyles = (steps, stepNameMapping) =>
  join(
    '',
    pipe(
      filter((s) => !isNil(s['shape_style'])),
      map((s) => `            ${s['shape_style'].replace('{name}', stepNameMapping[s.name])}\n`),
    )(steps),
  );

const generateMermaidNodeClicks = (steps, stepNameMapping) =>
  join(
    '',
    pipe(
      filter((s) => !isNil(s['tip_text'])),
      map(
        (s) =>
          `            click ${stepNameMapping[s.name]} "${s.click_url}" "${s.tip_text.label}:<br><pre>${
            s.tip_text.text
          }</pre>"\n`,
      ),
    )(steps),
  );

const parseConfiguration = (workflow) => {
  const basicConfig = [
    {
      key: 'Name',
      value: workflow['name'],
    },
    {
      key: 'Single Threaded?',
      value: workflow['singleThreaded'],
    },
    {
      key: 'Active?',
      value: workflow['active'],
    },
    {
      key: 'Number of Steps',
      value: length(workflow['steps']),
    },
    {
      key: 'Number of Triggers',
      value: length(workflow['triggers']),
    },
  ];
  const configItems = workflow['configuration'];
  const configValues = filter((x) => x.type === 'value')(configItems);
  const configElements = filter((x) => x.type === 'elementInstance')(configItems);

  return `<h3>Basic</h3>${buildTable(['key', 'value'], basicConfig)}
    <br/><h3>Elements</h3>${buildTable(['key', 'name', 'required'], configElements)}
    <br/><h3>Values</h3>${buildTable(['key', 'name', 'required'], configValues)}<br/>`;
};

const buildTable = (headers, values) => {
  const rowTemplate = '<tr>{values}</tr>';
  const header = rowTemplate.replace('{values}', join('', map((h) => `<th>${h}</th>`)(headers)));
  const rows = join(
    '',
    map((value) => rowTemplate.replace('{values}', join('', map((header) => `<td>${value[header]}</td>`)(headers))))(
      values,
    ),
  );
  return `<table>${header}${rows}</table>`;
};

module.exports = async (formula, formulaDirName) => {
  try {
    console.log(`Generating FlowChart for Formula: ${formula.name}`);
    const sortedSteps = sortSteps(formula.triggers[0], formula.steps);
    let parsedSteps = concat([parseTrigger(formula.triggers[0])], chain(parseStep, sortedSteps));

    //Hyper link stuff
    let tempStepCount = {};
    forEach((step) => {
      forEach((link) => {
        if (tempStepCount[link.dest]) {
          tempStepCount[link.dest] = tempStepCount[link.dest] + 1;
        } else {
          tempStepCount[link.dest] = 1;
        }
      })(step.links);
    })(parsedSteps);

    let massSteps = [];
    forEachObjIndexed((val, key) => {
      if (val > 5) {
        massSteps.push(key);
      }
    })(tempStepCount);

    let newStepsToAdd = [];
    forEach((replace) => {
      let counter = 0;
      forEach((step) => {
        if (step.name === replace) {
          const style = step['shape_style'];
          if (style instanceof String) {
            step['shape_style'] = `${style.substring(0, style.length - 1)}fill:#dda7f9;`;
          } else {
            step['shape_style'] = `style {name} fill:#dda7f9;`;
          }
        }
        forEach((link) => {
          if (link.dest === replace) {
            const newName = `${replace}-${counter}`;
            link.dest = newName;
            counter += 1;
            newStepsToAdd.push({
              name: newName,
              label: replace,
              type: 'end',
              json: '',
              links: [],
              shape: getShape('script'),
              shape_style: getShapeStyle('wormhole'),
              click_url: undefined,
              tip_text: undefined,
            });
          }
        })(step.links);
      })(parsedSteps);
    })(massSteps);

    parsedSteps.push(...newStepsToAdd);

    //End hyper link stuff

    //Generate StepNameMapping
    let stepNameMapping = {};
    let cnt = 0;
    forEach((step) => {
      stepNameMapping[step.name] = `step-${lpad(cnt, 3)}`;
      cnt += 1;
    })(parsedSteps);

    //Determine longest code block, for end spacing
    let maxCodeBlock = reduce(
      max,
      0,
      pipe(
        filter((s) => !isNil(s.tip_text) && !isNil(s.tip_text.text)),
        map((s) => s.tip_text.text.split('<br>').length - 1),
      )(parsedSteps),
    );

    if (maxCodeBlock > 33) maxCodeBlock -= 33;

    //Construct Mermaid Markdown graph
    let mermaidString = `        graph TD\n
          ${generateMermaidNodes(parsedSteps, stepNameMapping)}
          ${generateMermaidLinks(parsedSteps, stepNameMapping)}
          ${generateMermaidNodeStyles(parsedSteps, stepNameMapping)}
          ${generateMermaidNodeClicks(parsedSteps, stepNameMapping)}`;

    //Generate File Name and Open File
    const formulaName = formula.name
      .replace(' ', '')
      .replace('+', '')
      .replace('=', '')
      .replace('-', '')
      .replace('&', '')
      .replace(':', '')
      .replace(';', '')
      .replace('/', '')
      .replace('>', '')
      .replace(/(\|)/g, '');

    writeFileSync(
      `${formulaDirName}/Flowchart-${formulaName}.html`,
      htmlFormulaTemplate
        .replace('{mermaid_title}', formula.name)
        .replace('{mermaid_title}', formula.name)
        .replace('{mermaid_flowchart}', mermaidString)
        .replace('{mermaid_end_spacing}', '<br>'.repeat(maxCodeBlock > 2 ? maxCodeBlock - 1 : maxCodeBlock))
        .replace('{mermaid_configuration}', parseConfiguration(formula)),
      'utf8',
    );
  } catch (error) {
    throw error;
  }
};
