let arr = [{
    subCatDetails: {
       _id: "65b4d6add0b9cc0aa84c10fe",
       name: 'react '
     }
   },
   {
     subCatDetails: {
       _id: "65b4d891d0b9cc0aa84c1132",
       name: 'python'
     }}]
   let obj = {}
   for(let each of arr){
       let newObj = {}
       newObj[each.subCatDetails._id] = each.subCatDetails.name
       obj = {...obj,...newObj}
   }
   console.log(obj)