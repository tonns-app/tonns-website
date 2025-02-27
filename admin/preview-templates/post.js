import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

export default function Post({ entry, widgetFor }) {
    function formatDate(dateString) {
        if (!dateString) {
            return ``;
        }
        const date = new Date(Date.parse(dateString));
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }


    return html`<section>
                    <p>Published on ${formatDate(entry.getIn(["data", "date"]))}</p>
                    <div class="card post">${widgetFor("body")}</div>
                </section>
                <section>
                    <div class="button-row">
                        <a class="button">Previous</a>
                        <a class="button">Home</a>
                        <a class="button">Next</a>
                    </div>
                </section>`;
}