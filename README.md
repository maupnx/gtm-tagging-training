# Voltra Motors — site de laboratório v2 (GTM + GA4 + tags de mídia)

Site estático e fictício para o treinamento de Tracking & Measurement. Não tem backend, não coleta dado pessoal e não representa nenhuma marca real.

## Publicar de graça (instrutor, 5 min, uma vez)
1. Crie um repositório público no GitHub (ex.: `lab-tagueamento`) e suba todos os arquivos desta pasta.
2. Settings → Pages → Source: `Deploy from a branch` → branch `main`, pasta `/ (root)` → Save.
3. Em 1–2 min o site fica em `https://<seu-usuario>.github.io/lab-tagueamento/`.

## Usar (cada participante)
Abra a URL com o ID do seu próprio contêiner:
`https://<seu-usuario>.github.io/lab-tagueamento/?gtm=GTM-XXXXXXX`

O ID fica salvo no navegador; as outras páginas já carregam o mesmo contêiner. Para trocar: `?gtm=off`.

## Eventos que o site publica no dataLayer
| Evento | Quando | Parâmetros |
| --- | --- | --- |
| (sem evento) | toda página, antes do GTM carregar | page_type, site_section |
| cta_click | clique em botão/link com data-cta (inclui os botões desenhados nos banners: monte_o_seu, saiba_mais) | cta_name, cta_location, vehicle_model |
| view_item | página de modelo | vehicle_model, ecommerce.items[] |
| form_start | primeira digitação no formulário | form_name |
| generate_lead | envio do formulário | form_name, vehicle_model, lead_city, lead_id, value, currency |
| thank_you_view | página de obrigado | lead_id, vehicle_model |

Abra o Console (F12) para ver cada push logado como `[dataLayer]`.

## Valores de cta_name
agendar_test_drive, ver_modelo, monte_o_seu, saiba_mais, baixar_ficha_tecnica, whatsapp, logo, voltar_home.

## Imagens
`assets/img/`: banners dos três modelos e logo da Voltra (geradas no WPP Open). Os botões "Monte o seu" e "Saiba mais" desenhados nos banners são áreas clicáveis rastreadas.
