export function formatToTitleCase(text: string) {
  let formattedText = '';

  text.split(' ').map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const formattedWord = firstLetter + word.slice(1);

    formattedText = formattedText ? `${formattedText} ${formattedWord}` : formattedWord;
  });

  return formattedText;
}
