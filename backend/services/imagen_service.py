import base64
import httpx
from config import CF_ACCOUNT_ID, CF_WORKER_AI_API_TOKEN, CF_MODEL

# client setup
url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{CF_MODEL}"

headers = {
    "Authorization": f"Bearer {CF_WORKER_AI_API_TOKEN}",
}


async def generate_thumbnail(
    prompt: str, style_prompt: str, headshot_url: str
) -> bytes:
    """
    Use Cloudflare API with flux-2-klein-9b as image generation model.
    Pass headshot URL directly as an input_image.
    Returns raw PNG bytes.
    """

    full_prompt = (
        f"{style_prompt}\n\n"
        f"User request: {prompt}\n\n"
        "IMPORTANT: The generated thumbnail MUST prominently feature the person "
        "shown in the provided reference headshot photo. Keep their likeness accurate."
    )

    resp = await httpx.AsyncClient.get(headshot_url)
    resp.raise_for_status()
    input_image_bytes = resp.content
    content_type = resp.headers.get("content-type", "image/png")

    response = await httpx.AsyncClient.post(
        url,
        headers=headers,
        data={
            "prompt": full_prompt,
            "width": "768",
            "height": "432",
        },
        files={
            "input_image_0": ("headshot.png", input_image_bytes, content_type),
        },
    )

    if response.status_code == 200:
        result = response.json()
        if result.get("success"):
            return base64.b64decode(result["result"]["image"])
    
    raise RuntimeError("No image generation result found in the response.")





























































# import requests
# import base64

# ACCOUNT_ID = "your_account_id"
# API_TOKEN = "your_api_token"
# MODEL = "@cf/black-forest-labs/flux-2-klein-9b"

# url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{MODEL}"

# headers = {
#     "Authorization": f"Bearer {API_TOKEN}",
# }

# # Open reference images as binary files
# files = {
#     "input_image_0": ("ref0.png", open("style_reference.png", "rb"), "image/png"),
#     "input_image_1": ("ref1.png", open("subject_reference.png", "rb"), "image/png"),
# }

# data = {
#     "prompt": "take the subject of image 1 and style it like image 0",
#     "width": "1024",
#     "height": "1024",
#     "guidance": "7.5",
# }

# response = requests.post(url, headers=headers, files=files, data=data)

# if response.status_code == 200:
#     result = response.json()
#     if result.get("success"):
#         image_base64 = result["result"]["image"]
#         image_bytes = base64.b64decode(image_base64)
#         with open("output_with_refs.png", "wb") as f:
#             f.write(image_bytes)
#         print("Image saved!")
# else:
#     print(f"HTTP {response.status_code}: {response.text}")

# # Don't forget to close files
# for f in files.values():
#     f[1].close()
