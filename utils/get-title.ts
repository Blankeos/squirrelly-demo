const TITLE_TEMPLATE = "%s | Squirrelly Demos";

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title);
}
