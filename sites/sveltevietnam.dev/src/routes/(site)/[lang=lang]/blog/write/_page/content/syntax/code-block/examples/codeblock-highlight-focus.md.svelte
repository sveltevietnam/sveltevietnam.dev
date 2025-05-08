```css title="highlight-focus.css"
.example {
  /* :::highlight error */
  @extend mx-auto; /* not supported */
  /* ::: */

  /* :::highlight warning */
  @apply mx-auto; /* not recommend */
  /* ::: */

  /* :::highlight */
  margin: 0 auto; /* good */
  /* ::: */

  /* :::highlight success */
  /* better */
  margin-left: auto;
  margin-right: auto;
  /* ::: */

  /* :::focus */
  margin-inline: auto; /* best */
  /* ::: */
}
```
