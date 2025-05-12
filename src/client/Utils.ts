// Fichier créé pour déclencher le workflow GitHub Pages
// Ce fichier est nécessaire pour le bon fonctionnement du build 
// puisqu'il est importé dans d'autres fichiers

import { generateCryptoRandomUUID } from "./Utils";

export function triggerGitHubWorkflow() {
  console.log("Triggering GitHub Pages workflow");
  return true;
}