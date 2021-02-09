let tds = []
let result = document.getElementById('result')
$('#main').find('td').each((i, td) => {
  let r = Math.floor(i / 4)
  if(!tds[r]) {
    tds[r] = [td]
  } else {
    tds[r].push(td)
  }
})
let bgcolor = [ '#fffaf4', '#e0e5df', '#dfd7d7', '#d8caaf', '#bfbfbf', '#b5c4b1', '#c5b8a5', '#9ca8b8', '#96a48b', '#8696a7', '#7b8b6f']
let color = ['grey', 'grey','grey','grey', 'white', 'white', 'white', 'white', 'white', 'white', 'white']
let numIndex = {
  2: 0, 4: 1, 8: 2, 16: 3, 32: 4, 64: 5, 128: 6, 256: 7, 512: 8, 1024: 9, 2048: 10
}

let divs = [[],[],[],[]]
let score = 0

function start () {
  randomAddNumm ()
  randomAddNumm ()
}

function restart() {
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      if(divs[i][j]) {
        divs[i][j].remove()
      }
    }
  }
  divs = [[],[],[],[]]
  result.style.display = 'none'
  updateScore(-score)
  start()
}

function getTraverseData(reverse) {
  let start = 0, delt = 1, end = 3, n = 0
  if (reverse) {
    start = 3
    delt = -1
    end = 0
    n = 3
  }
  return {start, delt, end, n};
}

function updateScore(newScore) {
  score += newScore
  document.getElementById('score').innerText = score
}

function traverseColumn (column, reverse = false) {
  let {start, delt, end, n} = getTraverseData(reverse);
  let last = -1
  for(let i = start; start > end ? i >= end : i <= end; i+= delt) {
    if(!isEmpty(i, column)) {
      if(last >= 0 && divs[last][column].num === divs[i][column].num) {
        divs[last][column].num = divs[last][column].num * 2
        updateScore(divs[last][column].num)
        divs[last][column].children[0].innerText = divs[last][column].num
        divs[last][column].style.background = bgcolor[numIndex[divs[last][column].num]]
        divs[last][column].style.color = color[numIndex[divs[last][column].num]]
        divs[i][column].remove()
        divs[i][column] = undefined
        last = -1
      } else {
        if (i !== n) {
          divs[n][column] = divs[i][column]
          divs[i][column] = undefined
          tds[n][column].appendChild(divs[n][column])
        }
        last = n
        n+=delt
      }
    }
  }
}

function traverseRow (row, reverse = false) {
  let {start, delt, end, n} = getTraverseData(reverse);
  let last = -1
  for(let i = start; start > end ? i >= end : i <= end; i+= delt) {
    if(!isEmpty(row, i)) {
      if(last >= 0 && divs[row][last].num === divs[row][i].num) {
        divs[row][last].num *= 2
        updateScore(divs[row][last].num)
        divs[row][last].children[0].innerText = divs[row][last].num
        divs[row][last].style.background = bgcolor[numIndex[divs[row][last].num]]
        divs[row][last].style.color = color[numIndex[divs[row][last].num]]
        divs[row][i].remove()
        divs[row][i] = undefined
        last = -1
      } else {
        if (i !== n) {
          divs[row][n] = divs[row][i]
          divs[row][i] = undefined
          tds[row][n].appendChild(divs[row][n])
        }
        last = n
        n+=delt
      }

    }
  }
}

document.addEventListener('keyup', e => {
  if(e.key === 'ArrowUp') {
    for(let j = 0; j < 4; j++) {
      traverseColumn(j)
    }
    checkIfWin()
    randomAddNumm ()
    checkIfGameOver ()
  } else if(e.key === 'ArrowDown') {
    for(let j = 0; j < 4; j++) {
      traverseColumn(j, true)
    }
    checkIfWin()
    randomAddNumm ()
    checkIfGameOver ()
  } else if(e.key === 'ArrowLeft') {
    for(let i = 0; i < 4; i++) {
      traverseRow(i)
    }
    checkIfWin()
    randomAddNumm ()
    checkIfGameOver ()
  } else if(e.key === 'ArrowRight') {
    for(let i = 0; i < 4; i++) {
      traverseRow(i, true)
    }
    checkIfWin()
    randomAddNumm ()
    checkIfGameOver ()
  }
})

function checkIfWin() {
  if(isWin()) {
    setTimeout(() => {
      result.style.display = 'block'
      document.getElementById('fail').style.display = 'none'
      document.getElementById('success').style.display = 'block'
    }, 500)
  }
}

function isWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if(divs[i][j] && divs[i][j].num >= 2048) {
        return true
      }
    }
  }
  return false
}

function checkIfGameOver() {
  if(isGameOver()) {
    setTimeout(() => {
      result.style.display = 'block'
      document.getElementById('fail').style.display = 'block'
      document.getElementById('success').style.display = 'none'
    }, 500)
  }
}

function randomAddNumm () {
  if(isGameOver()) {
    return
  }
  while (true) {
    let i = Math.floor(Math.random() * 4)
    let j = Math.floor(Math.random() * 4)
    if(isEmpty(i, j)) {
      let div = generateANumDiv()
      divs[i][j] = div
      tds[i][j].appendChild(div)
      break
    }
  }
}
function isEmpty(i, j) {
  return !divs[i][j]
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      if(isEmpty(i, j)) {
        return false
      }
    }
  }
  return true
}

function generateANumDiv() {
  let div = document.createElement('div')
  div.style = 'position: relative;text-align: center;width:100px;height:100px;'
  let span = document.createElement('span')
  span.style='position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);font-size:40px;'
  let idx = Math.floor(Math.random() * 2);
  span.innerText = idx === 0 ? 2 : 4
  div.style.background = bgcolor[idx]
  div.style.color = color[idx]
  div.num = idx === 0 ? 2 : 4
  div.appendChild(span)
  return div
}

start()

