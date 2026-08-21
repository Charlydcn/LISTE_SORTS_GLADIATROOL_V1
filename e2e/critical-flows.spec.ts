import { expect, test } from "@playwright/test";

const canRunLocal = process.env.E2E_RUN_LOCAL === "1" && Boolean(process.env.E2E_SUPABASE_ANON_KEY);

test.describe("parcours critiques locaux", () => {
  test.skip(!canRunLocal, "Exécuter uniquement contre Supabase local avec E2E_RUN_LOCAL=1.");

  test("consultation invité, navigation de classe et sélection de sort", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Consulter en tant qu’invité" }).click();
    await expect(page.getByText("Mode invité")).toBeVisible();
    await page.getByRole("link", { name: /Feca/ }).click();
    await expect(page.getByRole("heading", { name: /Feca/ })).toBeVisible();
    await page.locator(".spell-tile").first().click();
    await expect(page.locator(".spell-card")).toBeVisible();
  });

  test("connexion, override persistant, reset, historique et commentaires", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Consulter en tant qu’invité" }).click();
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.getByLabel("Email").fill("admin@example.test");
    await page.getByLabel("Mot de passe").fill("admin-test-password");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByText("admin@example.test")).toBeVisible();

    await page.getByRole("link", { name: /Feca/ }).click();
    await page.locator(".spell-tile").first().click();
    const card = page.locator(".spell-card");
    await card.locator(".editable-trigger").first().click();
    const editor = card.getByLabel("Nouvelle valeur");
    await editor.fill("6");
    await card.getByRole("button", { name: "Enregistrer" }).click();
    await expect(card.getByText("6 PA")).toBeVisible();
    await page.reload();
    await page.locator(".spell-tile").first().click();
    await expect(page.locator(".spell-card").getByText("6 PA")).toBeVisible();

    await page.getByRole("button", { name: "Historique" }).click();
    await expect(page.getByText("Historique global")).toBeVisible();
    await page.getByRole("button", { name: "Fermer" }).click();

    const comments = page.locator(".comments-section");
    await comments.getByLabel(/Ajouter un commentaire/).fill("Commentaire e2e");
    await comments.getByRole("button", { name: "Publier" }).click();
    await expect(comments.getByText("Commentaire e2e")).toBeVisible();
    await comments.getByRole("button", { name: "Modifier" }).click();
    await comments.getByLabel("Modifier le commentaire").fill("Commentaire e2e modifié");
    await comments.getByRole("button", { name: "Enregistrer" }).click();
    await expect(comments.getByText("Commentaire e2e modifié")).toBeVisible();
    await comments.getByRole("button", { name: "Supprimer" }).click();
    await comments.getByRole("button", { name: "Vraiment ?" }).click();
    await expect(comments.getByText("Aucun commentaire.")).toBeVisible();

    await page.locator(".spell-card .reset-button").click();
    await page.getByRole("button", { name: "Vraiment ?" }).click();
    await expect(page.getByText("1 valeur réinitialisée.")).toBeVisible();
  });

  test("signale explicitement un échec de chargement", async ({ page }) => {
    await page.route("**/data/feca.json", (route) => route.fulfill({ status: 500, body: "erreur" }));
    await page.goto("/");
    await page.getByRole("button", { name: "Consulter en tant qu’invité" }).click();
    await expect(page.getByRole("alert")).toContainText("Impossible de charger les données JSON");
    await expect(page.getByRole("button", { name: "Réessayer" })).toBeVisible();
  });
});
