<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportTemplate.aspx.cs" Inherits="testReport.WebForm1" %>

<%--<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>--%>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<%--<link href="Content/bootstrap.css" rel="stylesheet" />
<script src="scripts/bootstrap.js"></script>--%>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div style="align-content: center">
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <rsweb:ReportViewer ID="rvSiteMapping1"
                runat="server"               
                ShowPrintButton="true"  
                ZoomMode="Percent"
                KeepSessionAlive="true"                
                DocumentMapWidth="100%" 
                SizeToReportContent="true"
                ShowParameterPrompts="false"
                Width="1200px"
                ShowToolBar="true" >
            </rsweb:ReportViewer>           
        </div>
    </form>
</body>
</html>



<%--<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportTemplate.aspx.cs" Inherits="Scienter.HotelERP.FrontOffice.WebUIMvc.ReportTemplate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>--%>
