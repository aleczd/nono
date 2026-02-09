f = open("input.txt","r")
feed = f.readlines()
f.close()

colour = feed[0].replace("\n","")
dim = feed[1].replace("\n","").split(",")
dim[0] = int(dim[0])
dim[1] = int(dim[1])
cols = []
rows= []
for i in range(2,2+dim[0]):
    cols.append(feed[i].replace("\n",""))
for i in range(2+dim[0],len(feed)):
    rows.append(feed[i].replace("\n",""))

#create colour map
cmapOG = []
for i in range(0,dim[0]):
    newArr = ["-"] * dim[1] 
    cmapOG.append(newArr)

def cdiDL(colData):
    cd = colData.split(",")
    cdi = []
    if cd == [""]:
        return [0]
    for j in range(0,len(cd)):
        cdi.append(int(cd[j]))
    return cdi


def acqCol(cmap,i):
    if 1 not in cmap[i]:
        return [0]
    ccd = []
    count = 0
    track = False
    for k in range(0,len(cmap[i])):
        if track:
            if cmap[i][k] == 1:
                count += 1
            else:
                ccd.append(count)
                count = 0
                track = False
        else:
            if cmap[i][k] == 1:
                count += 1
                track = True
    if track:
        ccd.append(count)
    return ccd

def acqRow(cmap,j):
    curRow = []
    for k in range(0,len(cmap)):
        curRow.append(cmap[k][j])
    if 1 not in curRow:
        return [0]
    crd = []
    count = 0
    track = False
    for k in range(0,len(curRow)):
        if track:
            if cmap[k][j] == 1:
                count += 1
            else:
                crd.append(count)
                count = 0
                track = False
        else:
            if cmap[k][j] == 1:
                count += 1
                track = True
    if track:
        crd.append(count)
    return crd















def violates(cmap,i,j):

    #looser conditions,
    # OR, apply simplifications intermittently


    #check cols
    cdi = cdiDL(cols[i])
    ccd = acqCol(cmap,i)
    #check lengths of col
    #print(ccd)
    if len(ccd) > len(cdi):
        #print(str(i),(j),"failed on chunk length for col")
        return True
    elif len(ccd) == len(cdi):
        #ensure less than its counterpart
        for k in range(0,len(cdi)):
            if ccd[k] > cdi[k]:
                #print(str(i),(j),"failed on chunk size for col")
                return True
    else:
        #ensure less than max chunk and less than total shaded
        maxC = max(cdi)
        for k in ccd:
            if k > maxC:
                #print(str(i),(j),"failed on max col")
                return True
        if sum(ccd) > sum(cdi):
            #print(str(i),(j),"failed on sum col")
            return True
        

    #check rows
    rdi = cdiDL(rows[j])
    crd = acqRow(cmap,j)
    #check lengths of row
    #print(crd)
    if len(crd) > len(rdi):
        #print(str(i),(j),"failed on chunk length for row")
        return True
    elif len(crd) == len(rdi):
        #ensure less than its counterpart
        #print("crd", crd)
        #print("rdi", rdi)
        for k in range(0,len(rdi)):
            if crd[k] > rdi[k]:
                #print(str(i),(j),"failed on chunk size for row")
                return True
    else:
        #ensure less than max chunk and less than total shaded
        maxC = max(rdi)
        for k in crd:
            if k > maxC:
                #print(str(i),(j),"failed on max row")
                return True
        if sum(crd) > sum(rdi):
            #print(str(i),(j),"failed on sum row")
            return True
    #print(str(i),(j),"success")
    return False


def valid(cmap):
    #check cols
    for i in range(0,len(cmap)):
        cdi = cdiDL(cols[i])
        ccd = acqCol(cmap,i)
        if ccd != cdi:
            #print("invalid cols", ccd, cdi)
            return False
    #check rows
    for j in range(0,len(cmap[0])):
        rdi = cdiDL(rows[j])
        crd = acqRow(cmap,j)
        #check lengths of row
        if crd != rdi:
            #print("invalid rows", crd, rdi)
            return False
    return True

def crossCheckRow(cmap,j):
    curRow = []
    for k in range(0,len(cmap)):
        curRow.append(cmap[k][j])
    rdi = cdiDL(rows[j])
    rSpace = 0
    for k in range(0,len(curRow)):
        if curRow[k] != "x":
            rSpace += 1
    if rSpace < sum(rdi):    #debatable limit here sum(rdi)+len(rdi)-1
        return True
    return False

def crossCheckCol(cmap,i):
    curCol = cmap[i]
    cdi = cdiDL(cols[i])
    cSpace = 0
    for k in range(0,len(curCol)):
        if curCol[k] != "x":
            cSpace += 1
    if cSpace < sum(cdi):  #debatable limit here
        return True
    return False

def crossOut(cmap,i,j):
    cdi = cdiDL(cols[i])
    ccd = acqCol(cmap,i)
    pos = []
    pos2 = []
    if ccd == cdi:
        #print("applied cross out on col")
        for k in range(0,len(cmap[i])):
            if cmap[i][k] == "-":
                cmap[i][k] = "x"
                pos.append([i,k])
                if crossCheckRow(cmap,k):
                    #print("cancelling crossout on col")
                    #print(pos)
                    for l in range(len(pos)):
                        cmap[pos[l][0]][pos[l][1]] = "-"
                    pos = []
                    break

    rdi = cdiDL(rows[j])
    crd = acqRow(cmap,j)
    if crd == rdi:
        #print("applied cross out on row")
        for k in range(0,len(cmap)):
            if cmap[k][j] == "-":
                cmap[k][j] = "x"
                pos2.append([k,j])
                if crossCheckCol(cmap,k):
                    #print("cancelling crossout on row")
                    #print(pos2)
                    for l in range(0,len(pos2)):
                        cmap[pos2[l][0]][pos2[l][1]] = "-"
                    pos2 = []
                    break
    
    return cmap, pos+pos2

def uncross(cmap,pos):
    for i in range(0,len(pos)):
        cmap[pos[i][0]][pos[i][1]] = "-"
    return cmap


def recursiveAlg(cmap,i,j):
    reject = [1,"x"]
    #check current solution is valid
    if cmap[i][j] == 1 and guide[i][j] == "x":
        #print("return on guide1")
        return False
    if violates(cmap,i,j):
        #print("return on violates")
        return False
    if valid(cmap):
        return cmap
    else:
        cmap, pos = crossOut(cmap,i,j)
        #print(cmap)
        for k in range(0,len(pos)):
            if guide[pos[k][0]][pos[k][1]] == 1:
                cmap = uncross(cmap,pos)
                #print("return on guide2")
                return False
        for k in range(0,len(cmap)):
            for l in range(0,len(cmap[k])):
                if (k == i and l >= j) or k > i:
                    if cmap[k][l] not in reject:
                        if cdiDL(cols[k]) == [0]:
                            cmap[k][l] = "x"
                            pos.append([k,l])
                        else:
                            cmap[k][l] = 1
                            result = recursiveAlg(cmap,k,l)
                            if result != False:
                                return result
                            else:
                                cmap[k][l] = "-"
            #check if column matches (cuts out work)
            if "-" in cmap[k]:
                cmap = uncross(cmap,pos)
                return False
    return False



###change this to do proper extremes by pushing everything max top then
## max down then for each chunk colour the ones that overlap
## no need to add fill and extremes, create this extremesv2.0

def extremes(colData,dim,v):
    cdi = cdiDL(colData)
    #do for first entry
    tempf1 = ([1] * cdi[0]) + ([0] * (dim[v]-cdi[0]))
    tempf2 = ([0] * (dim[v]-cdi[0])) + ([1] * cdi[0])
    pos = []
    for i in range(0,len(tempf1)):
        if (tempf1[i] == 1) and (tempf2[i] == 1):
            pos.append(i)
    if len(cdi) > 1:
        tempf1 = ([1] * cdi[-1]) + ([0] * (dim[v]-cdi[-1]))
        tempf2 = ([0] * (dim[v]-cdi[-1])) + ([1] * cdi[-1])
        pos2 = []
        for i in range(0,len(tempf1)):
            if (tempf1[i] == 1) and (tempf2[i] == 1):
                pos2.append(i)
        pos = set(pos)
        pos2 = set(pos2)
        pos = list(pos.union(pos2))
    return pos


    
    


def addFill(colData,dim,v):
    cdi = cdiDL(colData)
    if (sum(cdi) + (len(cdi)-1)) == dim[v]:
        final = [] * dim[v]
        for i in range(0,len(cdi)):
            final += [1]*cdi[i]
            final += ["x"]
        final.pop()
        return final
    return False


    #iterate through cols fully then rows fully
    #apply the simplifications first
def initSimplification(cmap):
    for i in range(0,len(cmap)):
        if cols[i] == "":
            cmap[i] = ["x"] * dim[1]
        else:
            afRes = addFill(cols[i],dim,1)
            if afRes != False: 
                cmap[i] = afRes
            else:
                extRes = extremes(cols[i],dim,1)
                if extRes != []:
                    for j in extRes:
                        cmap[i][j] = 1

    for i in range(0,len(cmap[0])):
        if rows[i] == "":
            for j in range(0,len(cmap)):
                cmap[j][i] = "x"
        else:
            afRes = addFill(rows[i],dim,0)
            if afRes != False: 
                for j in range(0,len(cmap)):
                    cmap[j][i] = afRes[j]
            else:
                extRes = extremes(rows[i],dim,0)
                if extRes != []:
                    for j in extRes:
                        cmap[j][i] = 1
    return cmap





def extremities(colData,dim,v):
    cdi = cdiDL(colData)
    if cdi == [0]:
        temp = ["x"] * dim[v]
        return temp, temp
    temp = ["-"] * dim[v]
    temp2 = ["-"] * dim[v]
    chunk = 1
    skip = False
    for i in range(0,len(temp)):
        if not skip:
            if cdi == []:
                break
            else:
                temp[i] = chunk
                cdi[0] = cdi[0]-1
                if cdi[0] == 0:
                    cdi.remove(0)
                    chunk += 1
                    skip = True
        else:
            skip = False
    cdi = cdiDL(colData)
    cdi.reverse()
    skip = False
    chunk -= 1
    for i in range(0,len(temp2)):
        if not skip:
            if cdi == []:
                break
            else:
                temp2[i] = chunk
                cdi[0] = cdi[0]-1
                if cdi[0] == 0:
                    cdi.remove(0)
                    chunk -= 1
                    skip = True
        else:
            skip = False
    temp2.reverse()
    #
    return temp,temp2

for i in range(0,len(cmapOG)):
    uq, lq = extremities(cols[i],dim,0)
    #print(uq,lq)
    crossOutQ = False
    if "x" in uq:
        crossOutQ = True
    for j in range(0,len(uq)):
        if crossOutQ:
            cmapOG[i][j] = "x"
        elif uq[j] == lq[j] and uq[j] != "-":
                cmapOG[i][j] = 1
#print("cmap:",cmapOG)
for i in range(0,len(cmapOG[0])):
    uq, lq = extremities(rows[i],dim,1)
    #print(uq,lq)
    crossOutQ = False
    if "x" in uq:
        crossOutQ = True
    for j in range(0,len(uq)):
        if crossOutQ:
            cmapOG[j][i] = "x"
        elif uq[j] == lq[j] and uq[j] != "-":
            cmapOG[j][i] = 1
#print("cmap:",cmapOG)

#so now cross out on all rows and cols
for i in range(0,len(cmapOG)):
    cmapOG, null = crossOut(cmapOG,i,0)
#print("col cross out:",cmapOG)

for j in range(0,len(cmapOG[0])):
    cmapOG, null = crossOut(cmapOG,0,j)
#print("row cross out:",cmapOG)
    

guide = cmapOG
#print("guide:", guide)
cmap2 = []
for i in range(0,dim[0]):
    newArr = ["-"] * dim[1] 
    cmap2.append(newArr)
print(recursiveAlg(cmap2,0,0))

#1. add way to deal with zero rows and columns
#2. add way for it to stop looping back on itself when it moves on
    # perhaps before you try it in standard code section
    # see if it has appeaared before as a configuration
    # create a configuration where reject is and add lists to the list corresponding
    # to the column in question, do the full row with 1 and 0
    # is looping back even a necessity in our code???
        # i think so yes, because if its the bottom that needs black
        # it goes there first then stacks them on top
        #
        # could try something with loop parameters instead???
#3. add tick function thing for progress updates on the k in recursive function 
