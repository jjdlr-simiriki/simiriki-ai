import azure.functions as func
import json
from datetime import datetime
from GuiaEngine import build_pdf_bytes

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.function_name(name="GuiaHttpTrigger")
@app.route(route="guia/generate", methods=["POST"])
def guia_generate(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse(json.dumps({"error":"Body must be JSON"}), status_code=400, mimetype="application/json")
    try:
        pdf_bytes = build_pdf_bytes(data)
        filename = f"Guia_Automatizacion_{data.get('company','Empresa')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        return func.HttpResponse(body=pdf_bytes, status_code=200, mimetype="application/pdf", headers=headers)
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": str(e)}), status_code=500, mimetype="application/json")
