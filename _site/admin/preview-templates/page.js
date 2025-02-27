import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

export default function Page({ entry, widgetFor }) {
    return html`<section class="top">
                    <h1 >${entry.getIn(["data", "title"])}</h1>
                </section>

                ${widgetFor("body")}`;
}