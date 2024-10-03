import turndown from 'turndown';

export const convertToMarkdown = (content: string) => {
  const turndownService = new turndown();
  const markdown = turndownService.turndown(content || '');

  return markdown;
};
