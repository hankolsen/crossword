const isValidKey = key => key.match(/^[a-zåäö]{1}$/i);
const preventKeyDown = key => key === 'Tab' || (key !== 'Backspace' && !isValidKey(key));

document
  .querySelectorAll('input')
  .forEach((input) => {

    const body = document.querySelector('body');

    // Toggle across/down on double click
    input.addEventListener('dblclick', () => body.classList.toggle('across'));

    // Prevent non alfa characters from being entered
    input.addEventListener('keydown', event => preventKeyDown(event.key) ? event.preventDefault() : true);

    // Handle user inputs
    input.addEventListener('keyup', ({ key, shiftKey, target }) => {
      // Ignore Shift key press, all non alfa characters, unless it is tab or backspace
      if (key === 'Shift' || (!key.match(/^[a-zåäö]{1}$/i) && key !== 'Tab' && key !== 'Backspace')) {
        return;
      }

      // By default we are moving in forward direction
      let direction = 1;
      // For SHIFT + TAB and Backspace we move backwards
      if ((key === 'Tab' && shiftKey) || key === 'Backspace') {
        direction = -1;
      }

      // Are we moving across or down
      const isAcross = body.classList.contains('across');

      // Get the coordinates for the current element
      const [currentRow, currentColumn] = target.id.match(/\d+/g);

      if (isAcross) {
        // We are moving across so, depending on the direction get the next or previous sibling
        const neighbour = direction > 0 ? target.nextElementSibling : target.previousElementSibling;
        // Make sure we actually have a sibling and that it is an input element
        if (neighbour && neighbour.nodeName === 'INPUT') {
          // Make sure that the sibling is on the same row
          const [neighbourRow] = neighbour.id.match(/\d+/g) || [];
          if (neighbourRow === currentRow) {
            // OK, move along to the sibling element
            neighbour.focus();
          }
        }
      } else {
        // We are moving down, so get the neighbouring element in the same column
        // but either below or above us
        const neighbour = document.querySelector(`#item${+currentRow + direction}-${currentColumn}`);
        // Make sure that we have a sibling element that is an input
        if (neighbour && neighbour.nodeName === 'INPUT') {
          neighbour.focus();
        }
      }
      // If there already is a letter in this box, update to the one pressed
      if (isValidKey(key)) {
        target.value = key; // eslint-disable-line no-param-reassign
      }
    });
  });
