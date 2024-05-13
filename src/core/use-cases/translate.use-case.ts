import { TranslateTextResponse } from "../../interfaces"

export const translateTextUseCase = async (prompt: string, lang: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_NEST_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, lang }),
    })

    const data = (await resp.json()) as TranslateTextResponse

    if (!resp.ok) throw new Error(`No se pudo realizar la traducción`)

    return {
      ok: true,
      message: data.message,
    }
  } catch (error) {
    return {
      ok: false,
      content: "No se pudo realizar la traducción",
    }
  }
}
