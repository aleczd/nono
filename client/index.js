
async function solveNono(){
    let cols = []
    let rows = []
    for (let i = 1; i <= parseInt(dim[0]); i++){
        cols.push(document.getElementById("c"+String(i)).value)
    }
    for (let i = 1; i <= parseInt(dim[0]); i++){
        rows.push(document.getElementById("r"+String(i)).value)
    }
    //console.log(colourSetting,dim,cols,rows)
    try{
        let response = await fetch("http://127.0.0.1:8090/solve?colour="+String(colourSetting)+"&dim="+String(dim)+"&cols="+String(cols)+"&rows="+String(rows))
        if(response.status == 404){
            throw new Error404("failed to fetch user details correctly")
        }
        else{
            info = await response.text()
        }
        //console.log(info)
    }
    catch{
        alert("Oh no, something went wrong when communicating to the server!")
    }
}

function buildSettings(){
    const style = document.getElementById("colourSolve")
    colourSetting = style.checked

    let size = document.getElementById("sizeSolve")
    let dimTry = size.options[size.options.selectedIndex].innerHTML.split("x")

    if (dimTry[0] == "Choose..."){
        alert("Please select a size...")
    }
    else{
        dim = dimTry
        if (colourSetting == true){
            alert("Sorry, NoNo Solver isn't able to solve colour puzzles just yet...")
        }
        else{
    
            let div = document.getElementsByClassName("nonoSettingsContainer")
            div[0].innerHTML = ""

            let invis = document.createElement("div")
            invis.classList.add("nonoSettings")
    
            let form = document.createElement("form")
            form.setAttribute("id", "inputNo")
            form.setAttribute("action", "/solve")
            form.setAttribute("method", "post")

            let cont = document.createElement("div")
            cont.classList.add("container")
            cont.classList.add("text-center")
            
            let only1 = document.createElement("div")
            only1.classList.add("row")

            let colsCont = document.createElement("div")
            colsCont.classList.add("col")

            let colTitle = document.createElement("h1")
            colTitle.innerHTML = "Columns:"
            colsCont.appendChild(colTitle)

            for (let i = 1; i <= parseInt(dim[0]); i++){
                let d1 = document.createElement("div")
                d1.classList.add("input-group")
                d1.classList.add("mb-3")

                let sp = document.createElement("span")
                sp.classList.add("input-group-text")
                sp.setAttribute("id","c"+String(i)+"Tag")
                sp.innerHTML = "Col."+String(i)

                let inp = document.createElement("input")
                inp.setAttribute("id","c"+String(i))
                inp.setAttribute("type","text")
                inp.setAttribute("name","c"+String(i))
                inp.classList.add("form-control")
                inp.setAttribute("placeholder","...,...,...etc")
                inp.setAttribute("aria-label","c"+String(i))
                inp.setAttribute("aria-describedby","c"+String(i)+"Tag")

                d1.appendChild(sp)
                d1.appendChild(inp)
                colsCont.appendChild(d1)
            }

            let rowCont = document.createElement("div")
            rowCont.classList.add("col")

            let rowTitle = document.createElement("h1")
            rowTitle.innerHTML = "Rows:"
            rowCont.appendChild(rowTitle)

            for (let i = 1; i <= parseInt(dim[1]); i++){
                let d1 = document.createElement("div")
                d1.classList.add("input-group")
                d1.classList.add("mb-3")

                let sp = document.createElement("span")
                sp.classList.add("input-group-text")
                sp.setAttribute("id","r"+String(i)+"Tag")
                sp.innerHTML = "Row"+String(i)

                let inp = document.createElement("input")
                inp.setAttribute("id","r"+String(i))
                inp.setAttribute("type","text")
                inp.setAttribute("name","r"+String(i))
                inp.classList.add("form-control")
                inp.setAttribute("placeholder","...,...,...etc")
                inp.setAttribute("aria-label","r"+String(i))
                inp.setAttribute("aria-describedby","r"+String(i)+"Tag")

                d1.appendChild(sp)
                d1.appendChild(inp)
                rowCont.appendChild(d1)
            }

            only1.appendChild(colsCont)
            only1.appendChild(rowCont)
            cont.appendChild(only1)
            form.appendChild(cont)

            form.appendChild(document.createElement("br"))

            let link = document.createElement("input")
            link.setAttribute("id","inputSetup")
            link.setAttribute("type","submit")
            link.setAttribute("name","inputSetup")
            link.setAttribute("value","Solve")
            link.classList.add("btn")
            link.classList.add("btn-primary")

            form.appendChild(link)
            invis.appendChild(form)
            div[0].appendChild(invis)
        }
    }

}

window.addEventListener("load", async function(event){
    try{
        let response = await fetch("http://127.0.0.1:8090/flicker")
        if(response.status == 404){
            throw new Error404("failed to fetch user details correctly")
        }
        else{
            info = await response.text()
        }
        let data = await JSON.parse(info)
        console.log(data)
        console.log(data.sol)

        if(Object.keys(data.meta).length == 2){
            document.getElementById("colourSolve").checked = true
        }
        if(data.meta.sizeSolve == 'Choose...'){
            alert("Please choose a size to solve!")
        }
        else if(data.meta !== false){
            let select = document.querySelector('#sizeSolve');
            select.value = data.meta.sizeSolve

            let dim = data.meta.sizeSolve.split("x")

            let div = document.getElementsByClassName("nonoSettingsContainer")
            div[0].innerHTML = ""

            let invis = document.createElement("div")
            invis.classList.add("nonoSettings")
    
            let form = document.createElement("form")
            form.setAttribute("id", "inputNo")
            form.setAttribute("action", "/solve")
            form.setAttribute("method", "post")

            let cont = document.createElement("div")
            cont.classList.add("container")
            cont.classList.add("text-center")
            
            let only1 = document.createElement("div")
            only1.classList.add("row")

            let colsCont = document.createElement("div")
            colsCont.classList.add("col")

            let colTitle = document.createElement("h1")
            colTitle.innerHTML = "Columns:"
            colsCont.appendChild(colTitle)

            for (let i = 1; i <= parseInt(dim[0]); i++){
                let d1 = document.createElement("div")
                d1.classList.add("input-group")
                d1.classList.add("mb-3")

                let sp = document.createElement("span")
                sp.classList.add("input-group-text")
                sp.setAttribute("id","c"+String(i)+"Tag")
                sp.innerHTML = "Col."+String(i)

                let inp = document.createElement("input")
                inp.setAttribute("id","c"+String(i))
                inp.setAttribute("type","text")
                inp.setAttribute("name","c"+String(i))
                inp.classList.add("form-control")
                inp.setAttribute("placeholder","...,...,...etc")
                inp.setAttribute("aria-label","c"+String(i))
                inp.setAttribute("aria-describedby","c"+String(i)+"Tag")

                d1.appendChild(sp)
                d1.appendChild(inp)
                colsCont.appendChild(d1)
            }

            let rowCont = document.createElement("div")
            rowCont.classList.add("col")

            let rowTitle = document.createElement("h1")
            rowTitle.innerHTML = "Rows:"
            rowCont.appendChild(rowTitle)

            for (let i = 1; i <= parseInt(dim[1]); i++){
                let d1 = document.createElement("div")
                d1.classList.add("input-group")
                d1.classList.add("mb-3")

                let sp = document.createElement("span")
                sp.classList.add("input-group-text")
                sp.setAttribute("id","r"+String(i)+"Tag")
                sp.innerHTML = "Row"+String(i)

                let inp = document.createElement("input")
                inp.setAttribute("id","r"+String(i))
                inp.setAttribute("type","text")
                inp.setAttribute("name","r"+String(i))
                inp.classList.add("form-control")
                inp.setAttribute("placeholder","...,...,...etc")
                inp.setAttribute("aria-label","r"+String(i))
                inp.setAttribute("aria-describedby","r"+String(i)+"Tag")

                d1.appendChild(sp)
                d1.appendChild(inp)
                rowCont.appendChild(d1)
            }

            only1.appendChild(colsCont)
            only1.appendChild(rowCont)
            cont.appendChild(only1)
            form.appendChild(cont)

            form.appendChild(document.createElement("br"))

            let link = document.createElement("input")
            link.setAttribute("id","inputSetup")
            link.setAttribute("type","submit")
            link.setAttribute("name","inputSetup")
            link.setAttribute("value","Solve")
            link.classList.add("btn")
            link.classList.add("btn-primary")

            form.appendChild(link)
            invis.appendChild(form)
            div[0].appendChild(invis)

            if (data.sol[0] == "["){
                let divSol = document.getElementsByClassName("solutionNonoContainer")
                divSol[0].innerHTML = ""

                let invis = document.createElement("div")
                invis.classList.add("solutionSettings")

                let grid = document.createElement("div")
                grid.classList.add("solutionGrid")

                let tempor = data.meta.sizeSolve.split("x")
                let qs = ""
                for (let i = 0; i < parseInt(tempor[0]);i++){
                    qs += "auto "
                }
                grid.setAttribute("style","grid-template-columns: "+qs+";")

                let solScape = []
                let toAdd = []
                for(let i = 0; i < (data.sol).length; i++){
                    if (data.sol[i] == "x" || data.sol[i] == "-" || data.sol[i] == "1"){
                        toAdd.push(data.sol[i])
                        if (toAdd.length == parseInt(tempor[1])){
                            solScape.push(toAdd)
                            toAdd = []
                        }
                    }
                }
                for (let i = 0; i < solScape[0].length; i++){
                    for(let j = 0; j < solScape.length; j++){
                        if (solScape[j][i] == "1"){
                            let cell = document.createElement("div")
                            cell.classList.add("solutionCell")
                            //cell.innerHTML="1"
                            grid.appendChild(cell)
                        }
                        else{
                            let cell = document.createElement("div")
                            cell.classList.add("emptyCell")
                            //cell.innerHTML="0"
                            grid.appendChild(cell)
                        }
                    }
                }

                invis.appendChild(grid)
                divSol[0].appendChild(invis)
            }
            else if (data.sol[0] === "F"){
                alert("Oops, our program wasn't able to solve this nono, please ensure the column and row settings are correct...")
                let div = document.getElementsByClassName("solutionNonoContainer")
                div.innerHTML = ""
            }
            else{
                let div = document.getElementsByClassName("solutionNonoContainer")
                div.innerHTML = ""
            }
        }
    }
    catch(e){
        alert("Oh no, something went wrong when trying to fetch the metadata!")
    }
})