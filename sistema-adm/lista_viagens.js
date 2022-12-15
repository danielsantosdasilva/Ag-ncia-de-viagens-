var tableData = [
    {
        'first_name': 'Diego',
        'last_name': 'Goiana ',
        'rank': '1',
    },
    {
        'first_name': 'Julia',
        'last_name': 'Fernanda ',
        'rank': '2',
    },
    {
        'first_name': 'Gabriel',
        'last_name': 'Guglielmi ',
        'rank': '3',
    },
    {
        'first_name': 'Daniel',
        'last_name': 'Santos ',
        'rank': '4',
    },
]

for (var i in tableData) {
    var row = `<tr>
        <td>${tableData[i].rank}</td>
        <td>${tableData[i].first_name}</td>
        <td>${tableData[i].last_name}</td>
            </tr>`

    var table = $(`#table-body`)
    table.append(row)
}
