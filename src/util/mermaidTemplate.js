const htmlFormulaTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>{mermaid_title}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/mermaid/6.0.0/mermaid.css" rel="stylesheet" type="text/css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/6.0.0/mermaid.min.js"></script>
    <script>mermaid.initialize({startOnLoad:true});</script>
    <script>
        var callback = function(){}
    </script>
    <style>
        div.mermaidTooltip {
                    margin-left: 50px;
                    text-align: left;
                    max-width: none;
                }
        .node rect,
        .node circle,
        .node ellipse,
        .node polygon {
                    fill: #ffffff;
                    stroke: rgb(200,200,200);
                    stroke-width: 2px;
                }
        .mermaid .label {
                  max-width: 50px;
                }
        table, th, td {
                    border: 1px solid black;
                }
        table {
                    border-spacing: 5px;
                    border-radius: 5px;
                    margin: auto;
                }
        th, td {
                    padding-left: 15px;
                    padding-right: 15px;
                    border-radius: 5px;
                }
        th {
                    color: blue;
                }
        td {
                    width: 180px;
                    text-align: center;
                    background-color: rgb(237, 241, 242);
                }
        h2 {
                    text-align: center;
                    border: 1px solid black;
                    border-radius: 5px;
                    padding: 1em;
                }
        .container {
                    text-align: center;
                    background-color: rgb(237, 241, 242);
                    font-size: 11px;
                    font-weight: 900;
                }
        body {
                    font-family: 'Arial';
                }
        .edgeLabel {
                    font-size: 9px;
                }
    </style>
</head>
<body>
    <h2>
        {mermaid_title}
    </h2>
    <div class="container">
        <div class="mermaid">
    {mermaid_flowchart}
        </div>
    </div>
    <h2>
        Formula Configuration
    </h2>
    <div class="container">
        {mermaid_configuration}
    </div>
    <div class="key">
        <h2>
            Key
        </h2>
        <table>
            <tr>
                <th>Description</th>
                <th>Symbol</th>
                <th>Description</th>
                <th>Symbol</th>
                <th>Description</th>
                <th>Symbol</th>
            </tr>

            <tr>
                <td>Filter Steps</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        A{Step Name}
                    </div>
                </td>
                <td>Trigger/End</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        B((Actual))
                        C((Generated))
                        style C stroke-width:2px,stroke-dasharray: 5, 5;
                    </div>
                </td>
                <td>Request Step</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        A>GET]
                        style A stroke:#0f6ab4;
                    </div>
                    <div class="mermaid">
                        graph TD
                        B>POST]
                        style B stroke:#10a54a;
                    </div>
                    <div class="mermaid">
                        graph TD
                        C>PATCH]
                        style C stroke:#D38042;
                    </div>
                    <div class="mermaid">
                        graph TD
                        C>PUT]
                        style C stroke:#C5862B;
                    </div>
                    <div class="mermaid">
                        graph TD
                        D>DELETE]
                        style D stroke:#a41e22;
                    </div>
                </td>
            </tr>
            <tr>
                <td>Script</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        D(Step Name)
                    </div>
                </td>
                <td>Loop</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        D(-Step Name-)
                    </div>
                </td>
                <td>Other(TYPE)</td>
                <td>
                    <div class="mermaid">
                        graph TD
                        D[Step Name]
                    </div>
                </td>
            </tr>
            <tr>
                <td>Pass/Fail Connection</td>
                <td>
                    <div class="mermaid">
                        graph LR
                        AL(A)
                        BL(B)
                        AL-->BL
                    </div>
                </td>
                <td>Generated Connection</td>
                <td>
                    <div class="mermaid">
                        graph LR
                        AL(A)
                        BL((B))
                        AL-.->BL
                        style BL stroke-width:2px,stroke-dasharray: 5, 5;
                    </div>
                </td>
                <td>Continue Connection</td>
                <td>
                    <div class="mermaid">
                        graph LR
                        AL(A)
                        BL(B)
                        AL==>BL
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div>
        {mermaid_end_spacing}
    </div>
</body>
</html>`

module.exports = {
    htmlFormulaTemplate
}