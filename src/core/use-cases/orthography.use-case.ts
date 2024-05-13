import type { OrthographyResponse } from "../../interfaces"

export const orthographyUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_NEST_API}/orthography-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    )
    const data = (await resp.json()) as OrthographyResponse

    if (!resp.ok) throw new Error(`No se pudo realizar correcion`)

    return {
      ok: true,
      ...data,
    }
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: "No se pudo realizar conexion con la IA",
    }
  }
}
