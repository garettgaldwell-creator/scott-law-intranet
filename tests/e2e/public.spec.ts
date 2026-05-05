import { expect, test } from "@playwright/test"

test("la page publique affiche Scott Law et le recrutement", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Scott Law" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Recrutement" }).first()).toBeVisible()
})

test("la page recrutement expose les champs contrôlés", async ({ page }) => {
  await page.goto("/recrutement")
  await page.getByLabel("Prénom").fill("Émile")
  await page.getByLabel("Nom").fill("Durand")
  await expect(page.getByLabel("Prénom")).toHaveValue("Émile")
  await expect(page.getByRole("button", { name: "Envoyer la candidature" })).toBeVisible()
})
