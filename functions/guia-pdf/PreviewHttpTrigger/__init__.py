import azure.functions as func
from GuiaEngine import build_pdf_bytes

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.function_name(name="PreviewHttpTrigger")
@app.route(route="guia/preview", methods=["GET"])
def guia_preview(req: func.HttpRequest) -> func.HttpResponse:
    sample = {
        "name": "Demo",
        "company": "Simiriki Preview",
        "email": "demo@simiriki.com",
        "offer_hint": "Desde MXN $2,490 — Diagnóstico + Plan 90 días",
        "links": {"checkout": "https://simiriki.com/activar", "booking": "https://simiriki.com/agenda"},
        "answers": {"has_crm": False, "billing": "manual", "marketing_channels": ["ads"], "support_channels": ["WhatsApp"], "uses_analytics": False, "lead_capture": "landing"}
    }
    pdf = build_pdf_bytes(sample)
    return func.HttpResponse(body=pdf, status_code=200, mimetype="application/pdf", headers={"Content-Disposition": 'attachment; filename="Guia_Preview.pdf"'})
