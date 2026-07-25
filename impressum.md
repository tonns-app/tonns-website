---
layout: legal
title: Impressum
eyebrow: Rechtliches
description: "Anbieterkennzeichnung der tonns GmbH gemäß § 5 TMG."
permalink: /impressum/
---

<div class="legal-card">
  <h2>Angaben gemäß § 5 TMG</h2>
  <dl class="legal-defs">
    <div>
      <dt>Unternehmen</dt>
      <dd>{{ site.company }}</dd>
    </div>
    <div>
      <dt>Anschrift</dt>
      <dd>{{ site.street }}<br>{{ site.city }}</dd>
    </div>
    <div>
      <dt>Handelsregister</dt>
      <dd>{{ site.hrb }}</dd>
    </div>
    <div>
      <dt>Registergericht</dt>
      <dd>{{ site.court }}</dd>
    </div>
    <div>
      <dt>USt-IdNr.</dt>
      <dd>{{ site.vat }}</dd>
    </div>
    <div>
      <dt>Vertreten durch</dt>
      <dd>{{ site.director }}</dd>
    </div>
  </dl>
</div>

<div class="legal-card">
  <h2>Kontakt</h2>
  <dl class="legal-defs">
    <div>
      <dt>E-Mail</dt>
      <dd><a href="mailto:{{ site.email }}">{{ site.email }}</a></dd>
    </div>
    <div>
      <dt>Telefon</dt>
      <dd><a href="tel:{{ site.phone_international }}">{{ site.phone }}</a></dd>
    </div>
  </dl>
</div>
