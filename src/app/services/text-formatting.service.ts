import { Injectable } from '@angular/core';
import { MINECRAFT_COLORS } from '../models/minecraftColors';

@Injectable({
  providedIn: 'root'
})
export class TextFormattingService {
  private convertColorCodes(text: string): string {
    let formattedText = text;

    // Replace Minecraft color codes with corresponding HTML/CSS
    Object.keys(MINECRAFT_COLORS).forEach(code => {
      const colorClass: any = MINECRAFT_COLORS[code];
      const regex = new RegExp(code, 'g');
      formattedText = formattedText.replace(regex, `<span class="${colorClass}">`);
    });

    // Close all opened spans
    formattedText += '</span>';

    // Handle text styles
    formattedText = formattedText.replace(/§k/g, '<span class="obfuscated">');
    formattedText = formattedText.replace(/§l/g, '<span class="bold">');
    formattedText = formattedText.replace(/§m/g, '<span class="strikethrough">');
    formattedText = formattedText.replace(/§n/g, '<span class="underline">');
    formattedText = formattedText.replace(/§o/g, '<span class="italic">');
    formattedText = formattedText.replace(/§r/g, '</span>');

    return formattedText;
  }

  public formatText(text: string): string {
    return this.convertColorCodes(text);
  }
}
