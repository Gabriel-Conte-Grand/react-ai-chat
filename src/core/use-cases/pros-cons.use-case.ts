import { ProsConsResponse } from "../../interfaces"

export const prosConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_NEST_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    )
    const data = (await resp.json()) as ProsConsResponse

    if (!resp.ok) throw new Error(`No se pudo realizar comparación`)

    return {
      ok: true,
      ...data,
    }
  } catch (error) {
    return {
      ok: false,
      content: "No se pudo realizar la comparación",
    }
  }
}
