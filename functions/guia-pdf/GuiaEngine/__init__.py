from __future__ import annotations
from datetime import datetime
from io import BytesIO
from reportlab.lib.pagesizes import LETTER
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

# Brand colors
BRAND_DARK   = colors.HexColor("#0A0F16")
BRAND_GREEN  = colors.HexColor("#22C55E")
BRAND_PURPLE = colors.HexColor("#8B5CF6")
BRAND_TEXT   = colors.HexColor("#0A0F16")

# Try to register custom fonts; fall back to Helvetica
try:
    pdfmetrics.registerFont(TTFont("Inter", "Inter-Regular.ttf"))
    pdfmetrics.registerFont(TTFont("Inter-Bold", "Inter-Bold.ttf"))
    BASE_FONT = "Inter"
    BOLD_FONT = "Inter-Bold"
except Exception:
    BASE_FONT = "Helvetica"
    BOLD_FONT = "Helvetica-Bold"

class HorizontalRule(Flowable):
    def __init__(self, width=450, thickness=1, color=colors.black):
        super().__init__()
        self.width = width
        self.thickness = thickness
        self.color = color
        self.height = thickness
    def draw(self):
        c = self.canv
        c.setStrokeColor(self.color)
        c.setLineWidth(self.thickness)
        c.line(0, 0, self.width, 0)

class ProgressBar(Flowable):
    def __init__(self, value: float, width=450, height=12, bg=colors.HexColor("#E5E7EB"), fg=BRAND_GREEN, radius=4):
        super().__init__()
        self.value = max(0.0, min(1.0, float(value)))
        self.width = width
        self.height = height
        self.bg = bg
        self.fg = fg
        self.radius = radius
    def draw(self):
        c = self.canv
        c.setFillColor(self.bg)
        c.roundRect(0, 0, self.width, self.height, self.radius, stroke=0, fill=1)
        c.setFillColor(self.fg)
        c.roundRect(0, 0, self.width * self.value, self.height, self.radius, stroke=0, fill=1)

def header_footer(canvas: Canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BRAND_DARK)
    canvas.rect(0, LETTER[1] - 40, LETTER[0], 40, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont(BOLD_FONT, 12)
    canvas.drawString(40, LETTER[1] - 27, "Simiriki · Guía de Automatización")
    canvas.setFont(BASE_FONT, 9)
    canvas.drawRightString(LETTER[0] - 40, LETTER[1] - 27, datetime.now().strftime("%d %b %Y"))
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.setFont(BASE_FONT, 8)
    canvas.drawString(40, 22, "Automatización digital para empresas humanas · simiriki.com")
    canvas.drawRightString(LETTER[0] - 40, 22, f"Página {doc.page}")
    canvas.restoreState()

def styles():
    s = getSampleStyleSheet()
    s["Normal"].fontName = BASE_FONT
    s["Normal"].fontSize = 10
    s["Normal"].leading = 14
    s.add(ParagraphStyle(name="H1", parent=s["Heading1"], fontName=BOLD_FONT, fontSize=24, leading=28, textColor=BRAND_TEXT, spaceAfter=12))
    s.add(ParagraphStyle(name="H2", parent=s["Heading2"], fontName=BOLD_FONT, fontSize=16, leading=20, textColor=BRAND_TEXT, spaceBefore=10, spaceAfter=8))
    s.add(ParagraphStyle(name="H3", parent=s["Heading3"], fontName=BOLD_FONT, fontSize=13, leading=16, textColor=BRAND_TEXT, spaceBefore=6, spaceAfter=6))
    s.add(ParagraphStyle(name="KPI", parent=s["Normal"], fontName=BOLD_FONT, fontSize=11, textColor=BRAND_DARK))
    s.add(ParagraphStyle(name="Muted", parent=s["Normal"], textColor=colors.HexColor("#4B5563")))
    s.add(ParagraphStyle(name="CTA", parent=s["Normal"], fontName=BOLD_FONT, textColor=colors.white, backColor=BRAND_GREEN, alignment=1, leading=16, spaceBefore=10, spaceAfter=10))
    return s

def maturity(a: dict) -> float:
    score = 0
    total = 0
    def add(condition):
        nonlocal score, total
        total += 1
        if condition:
            score += 1
    add(bool(a.get("has_crm")))
    add(a.get("billing") in ("automated", "integrated"))
    add(len(a.get("marketing_channels", [])) >= 2)
    add(bool(a.get("support_channels") and len(a["support_channels"]) >= 2))
    add(bool(a.get("uses_analytics")))
    add(a.get("lead_capture") in ("embedded", "landing"))
    return 0.0 if total == 0 else score / float(total)

def opps(a: dict):
    blocks = []
    if not a.get("has_crm"):
        blocks.append(("Implementar CRM + Automatización de Leads", [
            "Seleccionar CRM ligero (HubSpot Starter / Dynamics 365 Sales lite).",
            "Capturar formularios y WhatsApp en un solo embudo.",
            "Auto-enrutar leads a Teams/Outlook y etiquetarlos por fuente."
        ]))
    else:
        blocks.append(("Optimizar tu CRM con IA", [
            "Pipelines claros y automatizaciones.",
            "Enriquecer contactos con datos y scoring.",
            "Alertas a Teams cuando un lead está 'caliente'."
        ]))
    if a.get("billing") in ("manual","spreadsheet"):
        blocks.append(("Automatizar Facturación y Cobranza", [
            "Integrar Stripe con contabilidad (CFDI).",
            "Recordatorios de pago con enlaces de 1 clic.",
            "Dashboard diario de MRR/ingresos a Teams."
        ]))
    channels = set(map(str.lower, a.get("marketing_channels", [])))
    if not channels or channels == {"ninguno"}:
        blocks.append(("Embudo de Captación Inicial", [
            "Landing clara + formulario.",
            "Secuencia de 3 correos (valor → caso → CTA).",
            "Retargeting básico (Google/Meta)."
        ]))
    elif "ads" in channels and "seo" not in channels:
        blocks.append(("Balancear Ads con SEO/Contenido", [
            "2 artículos pilar/mes.",
            "Video corto enlazado a la landing.",
            "Lead magnet: esta Guía."
        ]))
    support = set(map(str.lower, a.get("support_channels", [])))
    if "whatsapp" in support and len(support) == 1:
        blocks.append(("Atención Omnicanal con IA", [
            "WhatsApp Business API + Teams.",
            "Bots para FAQs y captura.",
            "Escalación a humano con historial."
        ]))
    if not a.get("uses_analytics"):
        blocks.append(("Fundamentos de Datos y Métricas", [
            "Analytics básico (Azure/Clarity).",
            "Definir 5 KPIs clave.",
            "Reporte diario automático."
        ]))
    return blocks

def plan(m: float):
    if m < 0.35:
        return [
            ("Día 0-30", ["Publicar landing + formulario.","Configurar Stripe y cobros.","Implementar CRM básico."]),
            ("Día 31-60", ["Secuencias de email y retargeting.","Automatizar facturación.","Dashboard diario a Teams."]),
            ("Día 61-90", ["Bot de WhatsApp.","Casos de éxito.","Optimizar embudos."])
        ]
    elif m < 0.7:
        return [
            ("Día 0-30", ["Refinar pipeline con scoring.","Integrar pagos/contabilidad.","Contenido pilar + videos."]),
            ("Día 31-60", ["Onboarding automatizado.","Bots de soporte.","Experimentos de pricing."]),
            ("Día 61-90", ["Propensión a compra.","SLA y playbooks.","Optimización multicanal."])
        ]
    else:
        return [
            ("Día 0-30", ["CI/CD de datos.","A/B pricing y embudos.","IA en ventas."]),
            ("Día 31-60", ["Soporte avanzado con LLM.","Partnerships/afiliados.","Reportes ejecutivos automáticos."]),
            ("Día 61-90", ["Modelos LTV/CAC.","Upsell/expansión.","Roadmap trimestral."])
        ]

def build_pdf_bytes(data: dict) -> bytes:
    s = styles()
    info = {k: data.get(k) for k in ("name", "company", "email", "date", "offer_hint")}
    a = data.get("answers", {})
    links = data.get("links", {})
    m = maturity(a)
    blocks = opps(a)
    pl = plan(m)

    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=LETTER, leftMargin=40, rightMargin=40, topMargin=60, bottomMargin=40)
    story = []

    # Cover page
    story.append(Spacer(1, 1.5 * cm))
    story.append(Paragraph(f"Guía de Automatización para {info.get('company', 'Tu Empresa')}", s["H1"]))
    story.append(Spacer(1, 0.25 * inch))
    meta = [
        ["Nombre", info.get("name","—")],
        ["Empresa", info.get("company","—")],
        ["Fecha", info.get("date", datetime.now().strftime("%d/%m/%Y"))],
        ["Correo", info.get("email","—")]
    ]
    tbl = Table(meta, colWidths=[3 * cm, 12 * cm])
    tbl.setStyle(TableStyle([
        ("FONTNAME", (0,0), (-1,-1), BASE_FONT),
        ("FONTSIZE", (0,0), (-1,-1), 10),
        ("TEXTCOLOR", (0,0), (-1,-1), colors.HexColor("#111827")),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.3 * inch))
    story.append(HorizontalRule(width=460, thickness=1, color=colors.HexColor("#E5E7EB")))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Automatización digital para empresas humanas", s["Muted"]))
    story.append(PageBreak())

    # Diagnostic
    story.append(Paragraph("Diagnóstico Inicial", s["H2"]))
    story.append(Spacer(1, 0.1 * inch))
    rows = [
        ["¿Usas CRM?", "Sí" if a.get("has_crm") else "No"],
        ["Facturación", (a.get("billing","—") or "—").capitalize()],
        ["Marketing", ", ".join(a.get("marketing_channels", ["—"]))],
        ["Soporte", ", ".join(a.get("support_channels", ["—"]))],
        ["Analytics", "Sí" if a.get("uses_analytics") else "No"],
        ["Captura de Leads", (a.get("lead_capture","—") or "—").capitalize()]
    ]
    tbl = Table(rows, colWidths=[5 * cm, 10 * cm])
    tbl.setStyle(TableStyle([
        ("FONTNAME", (0,0), (-1,-1), BASE_FONT),
        ("FONTSIZE", (0,0), (-1,-1), 10),
        ("TEXTCOLOR", (0,0), (-1,-1), colors.HexColor("#111827")),
        ("GRID", (0,0), (-1,-1), 0.25, colors.HexColor("#E5E7EB")),
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#F9FAFB")),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#F9FAFB")]),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 6)
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Nivel de madurez digital", s["H3"]))
    story.append(Spacer(1, 0.05 * inch))
    story.append(ProgressBar(m, width=460, height=12, fg=BRAND_PURPLE if m >= 0.5 else BRAND_GREEN))
    story.append(Spacer(1, 0.05 * inch))
    story.append(Paragraph(f"Puntaje: {int(round(m*100,0))} / 100", s["KPI"]))
    story.append(Spacer(1, 0.2 * inch))

    # Opportunities
    story.append(PageBreak())
    story.append(Paragraph("Oportunidades de Automatización", s["H2"]))
    story.append(Spacer(1, 0.1 * inch))
    for title, bullets in blocks:
        story.append(Paragraph(title, s["H3"]))
        items = [[f"• {b}"] for b in bullets]
        tbl = Table(items, colWidths=[16 * cm])
        tbl.setStyle(TableStyle([
            ("FONTNAME", (0,0), (-1,-1), BASE_FONT),
            ("FONTSIZE", (0,0), (-1,-1), 10),
            ("TEXTCOLOR", (0,0), (-1,-1), colors.HexColor("#111827")),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ("TOPPADDING", (0,0), (-1,-1), 4)
        ]))
        story.append(tbl)
        story.append(Spacer(1, 0.15 * inch))

    # Plan
    story.append(PageBreak())
    story.append(Paragraph("Plan de Acción Recomendado (90 días)", s["H2"]))
    story.append(Spacer(1, 0.1 * inch))
    for phase, bullets in pl:
        story.append(Paragraph(phase, s["H3"]))
        items = [[f"• {b}"] for b in bullets]
        tbl = Table(items, colWidths=[16 * cm])
        tbl.setStyle(TableStyle([
            ("FONTNAME", (0,0), (-1,-1), BASE_FONT),
            ("FONTSIZE", (0,0), (-1,-1), 10),
            ("TEXTCOLOR", (0,0), (-1,-1), colors.HexColor("#111827")),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ("TOPPADDING", (0,0), (-1,-1), 4)
        ]))
        story.append(tbl)
        story.append(Spacer(1, 0.15 * inch))

    # CTA
    story.append(PageBreak())
    story.append(Paragraph("Activa tu Plan de Automatización", s["H2"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(info.get("offer_hint", "Desde MXN $2,490 — Diagnóstico + Plan 90 días"), s["KPI"]))
    story.append(Spacer(1, 0.15 * inch))
    book_style = ParagraphStyle("CTA_PURPLE", parent=s["CTA"], backColor=BRAND_PURPLE)
    story.append(Paragraph(f'<link href="{links.get("checkout","https://simiriki.com/activar")}">Pagar ahora · Stripe</link>', s["CTA"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(f'<link href="{links.get("booking","https://simiriki.com/agenda")}">Reservar sesión · Microsoft Bookings</link>', book_style))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("¿Dudas o soporte?", s["H3"]))
    story.append(Paragraph("Escríbenos a contacto@simiriki.com · Respondemos en 1 día hábil.", s["Muted"]))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    return buf.getvalue()
