module.exports = function(date) {
    var d = new Date();
    var seasonArray = [
        {name: 'spring', date: new Date(d.getFullYear(),2,(d.getFullYear() % 4 === 0) ? 19 : 20).getTime()},
        {name: 'summer', date: new Date(d.getFullYear(),5,(d.getFullYear() % 4 === 0) ? 20 : 21).getTime()},
        {name: 'autumn', date: new Date(d.getFullYear(),8,(d.getFullYear() % 4 === 0) ? 22 : 23).getTime()},
        {name: 'winter', date: new Date(d.getFullYear(),11,(d.getFullYear() % 4 === 0) ? 20 : 21).getTime()}
    ];   
    const season = seasonArray.filter(({ date }) => date <= d).slice(-1)[0] || {name: "winter"}
    return season.name;
  }