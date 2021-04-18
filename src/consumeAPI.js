import React, { useState } from 'react';
import buildings from './buildings';
import useDidMountEffect from './useDidMountEffect';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Card, CardContent } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    background: '#85C1E9'
  },
  card: {
    background: '#D5F5E3'
  }
})

function Data() {
  const classes = useStyles();

  const [building, setBuilding] = useState(619);
  const [buildingData, setBuildingData] = useState({});
  const [displayBuilding, setDisplayBuilding] = useState(false);

  const [floor, setFloor] = useState('all');
  const [floorData, setFloorData] = useState({});
  const [availableFloors, setAvailableFloors] = useState(['1', '2', '3', '4', '6', 'b', 's']);
  const [displayFloor, setDisplayFloor] = useState(false);

  function searchBuilding(buildingCode) {
    fetch ('http://localhost:3001/getbuildingdensity/' + String(buildingCode))
    .then(res => res.json())
    .then(data => {
      console.log(data)
    setBuildingData(data)})
    .catch(err => console.log(err))
  }

  function searchFloor(buildingCode, buildingFloor) {
    fetch ('http://localhost:3001/getbuildingdensity/' + String(buildingCode) + '/' + String(buildingFloor))
    .then(res => res.json())
    .then(data => {
      console.log(data)
    setFloorData(data)})
    .catch(err => console.log(err))
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (floor == 'all') {
      searchBuilding(building);
    } else {
      searchFloor(building, floor);
    }
  }

  function handleBuildingChange(event) {
    setBuilding(event.target.value);
    setFloor('all');
  }

  function handleFloorChange(event) {
    setFloor(event.target.value);
  }

  useDidMountEffect(() => {
    setDisplayFloor(false);
    setDisplayBuilding(true);
  }, [buildingData]);

  useDidMountEffect(() => {
    setAvailableFloors(buildingData.floors);
  }, [buildingData]);

  useDidMountEffect(() => {
    setDisplayBuilding(false);
    setDisplayFloor(true);
  }, [floorData]);

  
  return (
    <div className={classes.root}>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>Choose a building: </label>
        <select id="buildings" value={building} onChange={handleBuildingChange}>
          {Object.keys(buildings).map(building => <option value={buildings[building]}>{building}</option>)}
        </select>
        <label> Choose floor(s): </label>
        <select id="floors" value={floor} onChange={handleFloorChange}>
          <option value="all">All</option>
          {availableFloors.map(floor => <option value={floor}>{floor}</option>)}
        </select>
        <br/>
        <br/>
        <Button type="submit" variant="contained" color="primary">Display Info</Button>
      </form>
      <br/>
      {displayBuilding &&
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h4">{buildingData.building_name}</Typography>
            <Typography variant="h5">{buildingData.building_desc} | Building Code: {buildingData.building_code}</Typography>
            <Typography variant="h6">Density Count: {buildingData.density_cnt}</Typography>
            <Typography variant="h6">Capacity: {buildingData.capacity}</Typography>
            <Typography variant="h6">DC Ratio: {buildingData.dc_ratio}</Typography>
            <Typography variant="h6">Floors: {buildingData.floors.join(', ')}</Typography>
          </CardContent>
        </Card>
      }
      {displayFloor &&
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h4">{floorData.building_name}</Typography>
            <Typography variant="h5">{floorData.building_desc} | Building Code: {buildingData.building_code}</Typography>
            <Typography variant="h6">Density Count: {floorData.density_cnt}</Typography>
            <Typography variant="h6">Capacity: {floorData.capacity}</Typography>
            <Typography variant="h6">DC Ratio: {floorData.dc_ratio}</Typography>
            <Typography variant="h6">Floor: {floorData.building_floor}</Typography>
          </CardContent>
        </Card>
      }
    </div>
  );
}

export default Data;