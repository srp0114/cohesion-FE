import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import { Posting } from "../model/posting";

const Search = () => {
  const [data, setData] = useState<Posting[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("query");

  console.log(search);
  useEffect(() => {
    axios
      .all([
        axios.get(`/api/free/list?search=${search}&page=0&size=4`),
        //axios.get(`/api/questions/list?search=${search}&page=0&size=4`),
        //axios.get(`/api/recruit/list?search=${search}&page=0&size=4`),
      ])
      .then(
        axios.spread((res) => {
          console.log(res.data);
         
          setData([
            ...res.data,
          ]);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {data.map((value, index) => {
        return (
          <Typography variant="h5" key={index}>
            {value.title}
            {value.content}
            {value.imgUrl}
            {value.stuId}
            {value.writer}
            {value.createdDate}
          </Typography>
        );
      })}
    </>
  );
};

export default Search;
