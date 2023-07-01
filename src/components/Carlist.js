import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../constants";
import {DataGrid} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import AddCar from "./AddCar"
import EditCar from "./EditCar";
import {IconButton, Stack} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function Carlist() {
  const [cars, setCars] = useState([]);

  const onDelClick = (url) => {

    if (window.confirm("Are you sure to delete?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(url, {
        method: 'DELETE',
        headers: {'Authorization': token}
      })
              .then(response => {
                if (response.ok) {
                  fetchCars();
                  setOpen(true);
                } else {
                  alert('Something went wrong!')
                }
              })
              .catch(err => console.error(err))
    }
  }

  const [open, setOpen] = useState(false);

  const columns = [
    {field: 'brand', headerName: 'Brand', width: 200},
    {field: 'model', headerName: 'Model', width: 200},
    {field: 'color', headerName: 'Color', width: 200},
    {field: 'year', headerName: 'Year', width: 200},
    {field: 'price', headerName: 'Price', width: 200},
    {
      field: '_links.car.href',
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: row =>
              <EditCar
                      data={row}
                      updateCar={updateCar}/>
    },
    {
      field: '_links.self.href',
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: row =>
              <IconButton
                      onClick={(() => onDelClick(row.id))}>
                <DeleteIcon color={"error"}/>
              </IconButton>
    }
  ];
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    //세션 저장소에서 토큰을 읽고
    //Authorization 헤더에 이를 포함한다.
    const token = sessionStorage.getItem("jwt");

    fetch(SERVER_URL + 'api/cars', {
      headers: {'Authorization': token}
    })
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err));
  }

  //새로운 자동차 추가
  const addCar = (car) => {
    const token = sessionStorage.getItem("jwt");

    fetch(SERVER_URL + 'api/cars',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify(car)
            })
            .then(response => {
              if (response.ok) {
                fetchCars();
              } else {
                alert('Something went wrong!');
              }
            })
            .catch(err => console.error(err))
  }
  //자동차 업데이트
  const updateCar = (car, link) => {
    const token = sessionStorage.getItem("jwt");

    fetch(link,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify(car)
            })
            .then(response => {
              if (response.ok) {
                fetchCars();
              } else {
                alert('Something went wrong!');
              }
            })
            .catch(err => console.error(err))
  }
  return (
          <React.Fragment>
            <Stack mt={2} mb={2}>
              <AddCar addCar={addCar}/>
            </Stack>
            <div>
              <DataGrid
                      rows={cars}
                      columns={columns}
                      disableSelectionOnClick={true}
                      getRowId={row => row._links.self.href}/>
              <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      onClose={() => setOpen(false)}
                      message={"Car deleted"}/>
            </div>
          </React.Fragment>
  )
}

export default Carlist;