---
title: "esbuild is faster but the built programs on average are slower"
date: "2021-04-05"
image: "013"
packages:
  - esbuild
  - rollup
  - "@babel/core"
tags:
  - js
  - ts
---

Programs built by esbuild v0.11.5 appear to perform **on average 27% slower** than the same code built by Rollup. Some packages perform more than 90% slower though! In this context, I can't use it in _production_.

Here are the details of the benchmarks. I hope it's me, not&nbsp;esbuild.

---

## Setup

- MacOS 11.2.3 Big Sur
- node 15.13
- npm 7.7.6
- `esbuild` 0.11.5
- `rollup` 2.44.0
- `@babel/core` 7.13.14
- `benchmark` 2.1.4

also, _the particulars_:

- esbuild [config](https://github.com/codsen/codsen/blob/main/scripts/esbuild.js)
- rollup config [generator](https://github.com/codsen/codsen/blob/main/packages/lect/src/rollupConfig.js) - also example of [config](https://github.com/codsen/codsen/blob/main/packages/string-strip-html/rollup.config.js) per-package
- babel [config](https://github.com/codsen/codsen/blob/main/babel.config.js)
- benchmarks [script](https://github.com/codsen/codsen/blob/main/scripts/run-perf.js)

## Results

{% from "macros/package-listing.njk" import packageListing %}
<div class="content-row__container">
<div class="content-row__packages content-row__packages-list">
<table class="data">
  <thead>
    <tr>
      <th></th>
      <th>CJS built using Rollup, ops/s.</th>
      <th>CJS built using esbuild, ops/s.</th>
      <th>difference</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{ packageListing("object-no-new-keys", packageJsons["object-no-new-keys"]) }}</td>
      <td>604,665</td>
      <td>880,577</td>
      <td class="table-data__best">45%</td>
    </tr>
    <tr>
      <td>{{ packageListing("util-array-object-or-both", packageJsons["util-array-object-or-both"]) }}</td>
      <td>1,417,168</td>
      <td>1,944,428</td>
      <td class="table-data__best">37%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-is-index-within", packageJsons["ranges-is-index-within"]) }}</td>
      <td>1,245,405</td>
      <td>1,687,385</td>
      <td class="table-data__best">35%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-get-values-by-key", packageJsons["ast-get-values-by-key"]) }}</td>
      <td>52,666</td>
      <td>68,463</td>
      <td class="table-data__best">29%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-delete-object", packageJsons["ast-delete-object"]) }}</td>
      <td>21,558</td>
      <td>27,404</td>
      <td class="table-data__best">27%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-sort", packageJsons["ranges-sort"]) }}</td>
      <td>1,206,225</td>
      <td>1,498,702</td>
      <td class="table-data__best">24%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-overlap-one-on-another", packageJsons["string-overlap-one-on-another"]) }}</td>
      <td>939,264</td>
      <td>1,164,131</td>
      <td class="table-data__best">23%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-split-by-whitespace", packageJsons["string-split-by-whitespace"]) }}</td>
      <td>28,761</td>
      <td>35,358</td>
      <td class="table-data__best">22%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-convert-indexes", packageJsons["string-convert-indexes"]) }}</td>
      <td>49,520</td>
      <td>60,141</td>
      <td class="table-data__best">21%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-deep-contains", packageJsons["ast-deep-contains"]) }}</td>
      <td>46,517</td>
      <td>55,476</td>
      <td class="table-data__best">19%</td>
    </tr>
    <tr>
      <td>{{ packageListing("edit-package-json", packageJsons["edit-package-json"]) }}</td>
      <td>17,628</td>
      <td>20,664</td>
      <td class="table-data__best">17%</td>
    </tr>
    <tr>
      <td>{{ packageListing("helga", packageJsons["helga"]) }}</td>
      <td>808,293</td>
      <td>946,780</td>
      <td class="table-data__best">17%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-set-all-values-to", packageJsons["object-set-all-values-to"]) }}</td>
      <td>93,886</td>
      <td>108,901</td>
      <td class="table-data__best">15%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-monkey-traverse", packageJsons["ast-monkey-traverse"]) }}</td>
      <td>7,331</td>
      <td>8,429</td>
      <td class="table-data__best">14%</td>
    </tr>
    <tr>
      <td>{{ packageListing("charcode-is-valid-xml-name-character", packageJsons["charcode-is-valid-xml-name-character"]) }}</td>
      <td>616,548</td>
      <td>708,691</td>
      <td class="table-data__best">14%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-monkey-util", packageJsons["ast-monkey-util"]) }}</td>
      <td>5,567,715</td>
      <td>6,258,121</td>
      <td class="table-data__best">12%</td>
    </tr>
    <tr>
      <td>{{ packageListing("easy-replace", packageJsons["easy-replace"]) }}</td>
      <td>343,214</td>
      <td>385,237</td>
      <td class="table-data__best">12%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-range-expander", packageJsons["string-range-expander"]) }}</td>
      <td>401,309</td>
      <td>441,705</td>
      <td class="table-data__best">10%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-loose-compare", packageJsons["ast-loose-compare"]) }}</td>
      <td>1,119,977</td>
      <td>1,231,384</td>
      <td class="table-data__best">9%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-flatten-all-arrays", packageJsons["object-flatten-all-arrays"]) }}</td>
      <td>112,809</td>
      <td>123,730</td>
      <td class="table-data__best">9%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-all-values-equal-to", packageJsons["object-all-values-equal-to"]) }}</td>
      <td>755,624</td>
      <td>817,277</td>
      <td class="table-data__best">8%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-offset", packageJsons["ranges-offset"]) }}</td>
      <td>5,431,865</td>
      <td>5,913,447</td>
      <td class="table-data__best">8%</td>
    </tr>
    <tr>
      <td>{{ packageListing("csv-split-easy", packageJsons["csv-split-easy"]) }}</td>
      <td>29,342</td>
      <td>31,505</td>
      <td class="table-data__best">7%</td>
    </tr>
    <tr>
      <td>{{ packageListing("str-indexes-of-plus", packageJsons["str-indexes-of-plus"]) }}</td>
      <td>5,612,898</td>
      <td>6,057,985</td>
      <td class="table-data__best">7%</td>
    </tr>
    <tr>
      <td>{{ packageListing("detect-is-it-html-or-xhtml", packageJsons["detect-is-it-html-or-xhtml"]) }}</td>
      <td>4,104,618</td>
      <td>4,336,869</td>
      <td class="table-data__best">5%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-char-suitable-for-html-attr-name", packageJsons["is-char-suitable-for-html-attr-name"]) }}</td>
      <td>138,053,165</td>
      <td>144,933,037</td>
      <td class="table-data__best">4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-left-right", packageJsons["string-left-right"]) }}</td>
      <td>2,796,142</td>
      <td>2,909,465</td>
      <td class="table-data__best">4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-unfancy", packageJsons["string-unfancy"]) }}</td>
      <td>184,901</td>
      <td>193,216</td>
      <td class="table-data__best">4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("bitbucket-slug", packageJsons["bitbucket-slug"]) }}</td>
      <td>463,477</td>
      <td>471,869</td>
      <td class="table-data__best">1%</td>
    </tr>
    <tr>
      <td>{{ packageListing("all-named-html-entities", packageJsons["all-named-html-entities"]) }}</td>
      <td>12,988,337</td>
      <td>13,076,600</td>
      <td class="">0%</td>
    </tr>
    <tr>
      <td>{{ packageListing("arrayiffy-if-string", packageJsons["arrayiffy-if-string"]) }}</td>
      <td>851,031,198</td>
      <td>852,625,728</td>
      <td class="">0%</td>
    </tr>
    <tr>
      <td>{{ packageListing("color-shorthand-hex-to-six-digit", packageJsons["color-shorthand-hex-to-six-digit"]) }}</td>
      <td>991,925</td>
      <td>995,975</td>
      <td class="">0%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-flatten-referencing", packageJsons["object-flatten-referencing"]) }}</td>
      <td>46,439</td>
      <td>46,879</td>
      <td class="">0%</td>
    </tr>
    <tr>
      <td>{{ packageListing("array-includes-with-glob", packageJsons["array-includes-with-glob"]) }}</td>
      <td>389,175</td>
      <td>388,184</td>
      <td class="table-data__worse">-1%</td>
    </tr>
    <tr>
      <td>{{ packageListing("csv-sort", packageJsons["csv-sort"]) }}</td>
      <td>828</td>
      <td>822</td>
      <td class="table-data__worse">-1%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-boolean-combinations", packageJsons["object-boolean-combinations"]) }}</td>
      <td>26,872</td>
      <td>26,850</td>
      <td class="table-data__worse">-1%</td>
    </tr>
    <tr>
      <td>{{ packageListing("regex-is-jsp", packageJsons["regex-is-jsp"]) }}</td>
      <td>857,259,446</td>
      <td>841,373,993</td>
      <td class="table-data__worse">-2%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-character-is-astral-surrogate", packageJsons["string-character-is-astral-surrogate"]) }}</td>
      <td>386,957,104</td>
      <td>380,800,575</td>
      <td class="table-data__worse">-2%</td>
    </tr>
    <tr>
      <td>{{ packageListing("util-nonempty", packageJsons["util-nonempty"]) }}</td>
      <td>758,700</td>
      <td>748,129</td>
      <td class="table-data__worse">-2%</td>
    </tr>
    <tr>
      <td>{{ packageListing("html-all-known-attributes", packageJsons["html-all-known-attributes"]) }}</td>
      <td>872,646,305</td>
      <td>853,734,857</td>
      <td class="table-data__worse">-3%</td>
    </tr>
    <tr>
      <td>{{ packageListing("html-entities-not-email-friendly", packageJsons["html-entities-not-email-friendly"]) }}</td>
      <td>8,152</td>
      <td>7,922</td>
      <td class="table-data__worse">-3%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-delete-key", packageJsons["object-delete-key"]) }}</td>
      <td>487</td>
      <td>476</td>
      <td class="table-data__worse">-3%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-is-empty", packageJsons["ast-is-empty"]) }}</td>
      <td>842,803</td>
      <td>816,877</td>
      <td class="table-data__worse">-4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("regex-empty-conditional-comments", packageJsons["regex-empty-conditional-comments"]) }}</td>
      <td>879,313,074</td>
      <td>844,474,669</td>
      <td class="table-data__worse">-4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("regex-jinja-specific", packageJsons["regex-jinja-specific"]) }}</td>
      <td>879,049,231</td>
      <td>848,836,389</td>
      <td class="table-data__worse">-4%</td>
    </tr>
    <tr>
      <td>{{ packageListing("array-pull-all-with-glob", packageJsons["array-pull-all-with-glob"]) }}</td>
      <td>80,492</td>
      <td>76,541</td>
      <td class="table-data__worse">-5%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-html-tag-opening", packageJsons["is-html-tag-opening"]) }}</td>
      <td>208,444</td>
      <td>199,699</td>
      <td class="table-data__worse">-5%</td>
    </tr>
    <tr>
      <td>{{ packageListing("regex-is-jinja-nunjucks", packageJsons["regex-is-jinja-nunjucks"]) }}</td>
      <td>927,186,953</td>
      <td>879,108,894</td>
      <td class="table-data__worse">-6%</td>
    </tr>
    <tr>
      <td>{{ packageListing("detect-templating-language", packageJsons["detect-templating-language"]) }}</td>
      <td>3,733,385</td>
      <td>3,473,999</td>
      <td class="table-data__worse">-7%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-contains-only-empty-space", packageJsons["ast-contains-only-empty-space"]) }}</td>
      <td>28,905</td>
      <td>26,653</td>
      <td class="table-data__worse">-8%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-language-code", packageJsons["is-language-code"]) }}</td>
      <td>1,795,426</td>
      <td>1,632,861</td>
      <td class="table-data__worse">-10%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-compare", packageJsons["ast-compare"]) }}</td>
      <td>45,942</td>
      <td>37,713</td>
      <td class="table-data__worse">-18%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-fill-missing-keys", packageJsons["object-fill-missing-keys"]) }}</td>
      <td>83,730</td>
      <td>68,346</td>
      <td class="table-data__worse">-19%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-monkey", packageJsons["ast-monkey"]) }}</td>
      <td>10,914</td>
      <td>8,680</td>
      <td class="table-data__worse">-21%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-get-object", packageJsons["ast-get-object"]) }}</td>
      <td>84,227</td>
      <td>65,060</td>
      <td class="table-data__worse">-23%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-media-descriptor", packageJsons["is-media-descriptor"]) }}</td>
      <td>681,155</td>
      <td>528,020</td>
      <td class="table-data__worse">-23%</td>
    </tr>
    <tr>
      <td>{{ packageListing("test-mixer", packageJsons["test-mixer"]) }}</td>
      <td>128,661</td>
      <td>90,184</td>
      <td class="table-data__worse">-30%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-relative-uri", packageJsons["is-relative-uri"]) }}</td>
      <td>965,326</td>
      <td>664,065</td>
      <td class="table-data__worse">-32%</td>
    </tr>
    <tr>
      <td>{{ packageListing("json-comb-core", packageJsons["json-comb-core"]) }}</td>
      <td>5,194</td>
      <td>3,554</td>
      <td class="table-data__worse">-32%</td>
    </tr>
    <tr>
      <td>{{ packageListing("line-column-mini", packageJsons["line-column-mini"]) }}</td>
      <td>536,985</td>
      <td>352,397</td>
      <td class="table-data__worse">-35%</td>
    </tr>
    <tr>
      <td>{{ packageListing("lerna-clean-changelogs", packageJsons["lerna-clean-changelogs"]) }}</td>
      <td>174,708</td>
      <td>108,303</td>
      <td class="table-data__worse">-39%</td>
    </tr>
    <tr>
      <td>{{ packageListing("check-types-mini", packageJsons["check-types-mini"]) }}</td>
      <td>24,786</td>
      <td>14,888</td>
      <td class="table-data__worse">-40%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-apply", packageJsons["ranges-apply"]) }}</td>
      <td>402,362</td>
      <td>240,594</td>
      <td class="table-data__worse">-41%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-ent-decode", packageJsons["ranges-ent-decode"]) }}</td>
      <td>313,404</td>
      <td>176,076</td>
      <td class="table-data__worse">-44%</td>
    </tr>
    <tr>
      <td>{{ packageListing("object-merge-advanced", packageJsons["object-merge-advanced"]) }}</td>
      <td>10,820</td>
      <td>5,918</td>
      <td class="table-data__worse">-46%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-trim-spaces-only", packageJsons["string-trim-spaces-only"]) }}</td>
      <td>1,122,252</td>
      <td>598,728</td>
      <td class="table-data__worse">-47%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-regex", packageJsons["ranges-regex"]) }}</td>
      <td>634,846</td>
      <td>325,307</td>
      <td class="table-data__worse">-49%</td>
    </tr>
    <tr>
      <td>{{ packageListing("json-variables", packageJsons["json-variables"]) }}</td>
      <td>4,663</td>
      <td>2,334</td>
      <td class="table-data__worse">-50%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-uglify", packageJsons["string-uglify"]) }}</td>
      <td>162,093</td>
      <td>75,494</td>
      <td class="table-data__ugly">-54%</td>
    </tr>
    <tr>
      <td>{{ packageListing("detergent", packageJsons["detergent"]) }}</td>
      <td>1,003</td>
      <td>447</td>
      <td class="table-data__ugly">-56%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ast-monkey-traverse-with-lookahead", packageJsons["ast-monkey-traverse-with-lookahead"]) }}</td>
      <td>8,446</td>
      <td>3,664</td>
      <td class="table-data__ugly">-57%</td>
    </tr>
    <tr>
      <td>{{ packageListing("array-of-arrays-into-ast", packageJsons["array-of-arrays-into-ast"]) }}</td>
      <td>21,030</td>
      <td>9,028</td>
      <td class="table-data__ugly">-58%</td>
    </tr>
    <tr>
      <td>{{ packageListing("generate-atomic-css", packageJsons["generate-atomic-css"]) }}</td>
      <td>40,356</td>
      <td>17,296</td>
      <td class="table-data__ugly">-58%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-remove-widows", packageJsons["string-remove-widows"]) }}</td>
      <td>4,967</td>
      <td>2,083</td>
      <td class="table-data__ugly">-59%</td>
    </tr>
    <tr>
      <td>{{ packageListing("tap-parse-string-to-object", packageJsons["tap-parse-string-to-object"]) }}</td>
      <td>72,457</td>
      <td>30,365</td>
      <td class="table-data__ugly">-59%</td>
    </tr>
    <tr>
      <td>{{ packageListing("array-group-str-omit-num-char", packageJsons["array-group-str-omit-num-char"]) }}</td>
      <td>123,562</td>
      <td>48,255</td>
      <td class="table-data__ugly">-61%</td>
    </tr>
    <tr>
      <td>{{ packageListing("email-all-chars-within-ascii", packageJsons["email-all-chars-within-ascii"]) }}</td>
      <td>304,707</td>
      <td>116,948</td>
      <td class="table-data__ugly">-62%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-process-outside", packageJsons["ranges-process-outside"]) }}</td>
      <td>139,148</td>
      <td>52,921</td>
      <td class="table-data__ugly">-62%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-merge", packageJsons["ranges-merge"]) }}</td>
      <td>402,352</td>
      <td>129,858</td>
      <td class="table-data__ugly">-68%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-find-heads-tails", packageJsons["string-find-heads-tails"]) }}</td>
      <td>83,697</td>
      <td>27,322</td>
      <td class="table-data__ugly">-68%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-match-left-right", packageJsons["string-match-left-right"]) }}</td>
      <td>89,936</td>
      <td>29,353</td>
      <td class="table-data__ugly">-68%</td>
    </tr>
    <tr>
      <td>{{ packageListing("html-img-alt", packageJsons["html-img-alt"]) }}</td>
      <td>38,241</td>
      <td>11,878</td>
      <td class="table-data__ugly">-69%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-remove-thousand-separators", packageJsons["string-remove-thousand-separators"]) }}</td>
      <td>76,826</td>
      <td>24,111</td>
      <td class="table-data__ugly">-69%</td>
    </tr>
    <tr>
      <td>{{ packageListing("html-table-patcher", packageJsons["html-table-patcher"]) }}</td>
      <td>422</td>
      <td>129</td>
      <td class="table-data__ugly">-70%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-invert", packageJsons["ranges-invert"]) }}</td>
      <td>266,478</td>
      <td>82,308</td>
      <td class="table-data__ugly">-70%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-process-comma-separated", packageJsons["string-process-comma-separated"]) }}</td>
      <td>359,421</td>
      <td>105,242</td>
      <td class="table-data__ugly">-71%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-remove-duplicate-heads-tails", packageJsons["string-remove-duplicate-heads-tails"]) }}</td>
      <td>5,214</td>
      <td>1,528</td>
      <td class="table-data__ugly">-71%</td>
    </tr>
    <tr>
      <td>{{ packageListing("stristri", packageJsons["stristri"]) }}</td>
      <td>535</td>
      <td>157</td>
      <td class="table-data__ugly">-71%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-collapse-white-space", packageJsons["string-collapse-white-space"]) }}</td>
      <td>82,405</td>
      <td>23,875</td>
      <td class="table-data__ugly">-72%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-crop", packageJsons["ranges-crop"]) }}</td>
      <td>533,039</td>
      <td>148,791</td>
      <td class="table-data__ugly">-73%</td>
    </tr>
    <tr>
      <td>{{ packageListing("codsen-tokenizer", packageJsons["codsen-tokenizer"]) }}</td>
      <td>10,075</td>
      <td>2,674</td>
      <td class="table-data__ugly">-74%</td>
    </tr>
    <tr>
      <td>{{ packageListing("is-html-attribute-closing", packageJsons["is-html-attribute-closing"]) }}</td>
      <td>295,486</td>
      <td>63,758</td>
      <td class="table-data__ugly">-79%</td>
    </tr>
    <tr>
      <td>{{ packageListing("codsen-parser", packageJsons["codsen-parser"]) }}</td>
      <td>6,672</td>
      <td>1,381</td>
      <td class="table-data__ugly">-80%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-fix-broken-named-entities", packageJsons["string-fix-broken-named-entities"]) }}</td>
      <td>82,165</td>
      <td>15,341</td>
      <td class="table-data__ugly">-82%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-extract-sass-vars", packageJsons["string-extract-sass-vars"]) }}</td>
      <td>40,932</td>
      <td>6,498</td>
      <td class="table-data__ugly">-85%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-collapse-leading-whitespace", packageJsons["string-collapse-leading-whitespace"]) }}</td>
      <td>1,741,567</td>
      <td>203,157</td>
      <td class="table-data__ugly">-89%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-extract-class-names", packageJsons["string-extract-class-names"]) }}</td>
      <td>268,807</td>
      <td>24,855</td>
      <td class="table-data__ugly">-91%</td>
    </tr>
    <tr>
      <td>{{ packageListing("array-of-arrays-sort-by-col", packageJsons["array-of-arrays-sort-by-col"]) }}</td>
      <td>2,631,276</td>
      <td>215,987</td>
      <td class="table-data__ugly">-92%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-push", packageJsons["ranges-push"]) }}</td>
      <td>1,369,476</td>
      <td>109,753</td>
      <td class="table-data__ugly">-92%</td>
    </tr>
    <tr>
      <td>{{ packageListing("js-row-num", packageJsons["js-row-num"]) }}</td>
      <td>12,136</td>
      <td>918</td>
      <td class="table-data__ugly">-93%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-apostrophes", packageJsons["string-apostrophes"]) }}</td>
      <td>48,811</td>
      <td>3,215</td>
      <td class="table-data__ugly">-94%</td>
    </tr>
    <tr>
      <td>{{ packageListing("ranges-iterate", packageJsons["ranges-iterate"]) }}</td>
      <td>12,707,835</td>
      <td>670,891</td>
      <td class="table-data__ugly">-95%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-find-malformed", packageJsons["string-find-malformed"]) }}</td>
      <td>324,137</td>
      <td>18,415</td>
      <td class="table-data__ugly">-95%</td>
    </tr>
    <tr>
      <td>{{ packageListing("string-strip-html", packageJsons["string-strip-html"]) }}</td>
      <td>8,835</td>
      <td>213</td>
      <td class="table-data__ugly">-98%</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td><strong>Average:</strong></td>
      <td class="table-data__worse">-27%</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td><strong>Median:</strong></td>
      <td class="table-data__worse">-18%</td>
    </tr>
  </tbody>
</table>
</div>
</div>

## Maybe my `esbuild` settings are wrong?

Programs benchmarked above were built using esbuild on the following [settings](https://github.com/codsen/codsen/blob/main/scripts/esbuild.js):

- `format` as `"cjs"`
- `bundle` on, but exclude any dependencies or peer dependencies (ends up bundling local imports only)
- `minify` on (to strip `console.log` and `console.time` instances which we keep in the source to help the maintainability)
- `target` as `node10.4`

There shouldn't be any surprises, though?

## You can try yourself

1. Clone codsen monorepo, `git clone https://github.com/codsen/codsen.git`
2. `cd codsen`
3. `npm run bootstrap` (it's a monorepo, you don't `npm i`, Lerna does it)
4. `cd` into any package's root, `cd packages/string-strip-html`
5. for Rollup, build and benchmark `npm run build && npm run perf`
6. for esbuild, build and benchmark `npm run esbuild && npm run perf`

Benchmarks run on a `cjs` build and vary depending on thermal throttling, machine's load and other factors.

## Takeaway

For me, `esbuild` still feels not production-ready yet, even the _perf_ issues aside:

- code coverage [comment](https://github.com/evanw/esbuild/issues/516) [stripping](https://github.com/evanw/esbuild/issues/578) challenge is unsolved
- missing plugins to remove `console.log` without minifying the bundle — [@rollup/plugin-strip](https://www.npmjs.com/package/@rollup/plugin-strip) equivalent
- no `umd`, only `iife` builds which we [can't unit-test](/articles/rollup-vs-esbuild:lessbrgreateriife-is-not-umd/)
- even then, `iife` builds are hard to tailor for the widest spectrum of browsers, compared to rollup + babel `env`

Fingers crossed, maybe esbuild will mature in a year or so. After all, it took three years and seven months for Rollup to reach v.1, and esbuild is still one-year-old!