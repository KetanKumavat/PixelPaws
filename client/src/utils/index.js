import FileSaver from "file-saver";
import { surpriseMePrompts } from "../constant";

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export async function downloadImage(_id, photo) {
  try {
    const response = await fetch(photo);
    const blob = await response.blob();
    FileSaver.saveAs(blob, `download-${_id}.jpg`);
  } catch (error) {
    console.error("Failed to download image", error);
  }
}
