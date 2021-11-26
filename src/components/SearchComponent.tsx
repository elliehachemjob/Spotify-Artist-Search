import React from "react";
import { Input } from "@mui/material";
import "../App.css";
import SearchIcon from "@mui/icons-material/Search";
interface Props {
  searchQuery?: string;
  onChange?: any;
}

function SearchComponent(props: Props) {
  return (
    <div>
      <Input
        className="css-input"
        style={{ maxWidth: 250 }}
        value={props.searchQuery}
        onChange={props.onChange}
      />
      <span>
        <SearchIcon style={{ position: "relative", right: 30, top: 10 }} />
      </span>
    </div>
  );
}

export default SearchComponent;
