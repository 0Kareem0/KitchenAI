import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'
/**
 * Challenge: See if you can figure out how to use the
 * react-markdown package to render `props.recipe` as React
 * elements rather than the plain markdown text.
 * 
 * Use the link in the slide to navigate directly to the
 * package's instructions on how to use it.
 */

export default function ClaudeRecipe(props) {
  return (
   <section className='suggested-recipe-container'
   aria-live="polite">
    <h2>Chef Claude Recommends:</h2>
    <ReactMarkdown>{props.recipe}</ReactMarkdown>
    </section>
  );
}
  