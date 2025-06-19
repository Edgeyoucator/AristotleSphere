let draggedItem = null;
let part1Complete = false;
let dragClone = null;
let touchOffsetX = 0;
let touchOffsetY = 0;


// Enable drag-and-drop for all draggable items

function setupDraggables() {
  document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', () => {
      draggedItem = item;
      setTimeout(() => {
        item.style.display = 'none';
      }, 0);
    });

    item.addEventListener('dragend', () => {
      setTimeout(() => {
        item.style.display = 'block';
        draggedItem = null;
      }, 0);
    });

    // Touch support
    item.addEventListener('touchstart', touchStartHandler, { passive: false });
    item.addEventListener('touchmove', touchMoveHandler, { passive: false });
    item.addEventListener('touchend', touchEndHandler);
  });
}


setupDraggables();

// Touch drag handlers
function touchStartHandler(e) {
  e.preventDefault();
  draggedItem = e.currentTarget;
  const rect = draggedItem.getBoundingClientRect();
  dragClone = draggedItem.cloneNode(true);
  dragClone.style.position = 'fixed';
  dragClone.style.left = `${rect.left}px`;
  dragClone.style.top = `${rect.top}px`;
  dragClone.style.width = `${rect.width}px`;
  dragClone.style.height = `${rect.height}px`;
  dragClone.style.pointerEvents = 'none';
  dragClone.style.zIndex = '1000';
  document.body.appendChild(dragClone);
  draggedItem.classList.add('dragging');
  draggedItem.style.display = 'none';
  const touch = e.touches[0];
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;
}

function touchMoveHandler(e) {
  e.preventDefault();
  if (!dragClone) return;
  const touch = e.touches[0];
  dragClone.style.left = `${touch.clientX - touchOffsetX}px`;
  dragClone.style.top = `${touch.clientY - touchOffsetY}px`;
}

function touchEndHandler(e) {
  e.preventDefault();
  if (!draggedItem) return;
  const touch = e.changedTouches[0];
  let placed = false;
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const rect = zone.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      if (zone.firstChild) {
        document.querySelector('.drag-bank').appendChild(zone.firstChild);
      }
      zone.appendChild(draggedItem);
      placed = true;
    }
  });

  if (!placed) {
    document.querySelector('.drag-bank').appendChild(draggedItem);
  }

  draggedItem.classList.remove('dragging');
  draggedItem.style.display = 'block';
  if (dragClone) dragClone.remove();
  dragClone = null;
  draggedItem = null;
}


// Set up each drop zone

document.querySelectorAll('.drop-zone').forEach(zone => {

  zone.addEventListener('dragover', e => e.preventDefault());



  zone.addEventListener('drop', () => {

    if (draggedItem) {

      if (zone.firstChild) {

        document.querySelector('.drag-bank').appendChild(zone.firstChild);

      }

      zone.appendChild(draggedItem);

    }

  });

});



document.querySelector('.drag-bank').addEventListener('dragover', e => {

  e.preventDefault();

});



document.querySelector('.drag-bank').addEventListener('drop', () => {

  if (draggedItem) {

    document.querySelector('.drag-bank').appendChild(draggedItem);

  }

});
