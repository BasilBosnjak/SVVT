import { StarIcon } from "@chakra-ui/icons";
import React from "react";

const Star = ({ rating = 0, star = 0 }) => {
  return (
    <StarIcon
      color={rating >= star || rating === 0 ? "cyan.500" : "gray.300"}
    />
  );
};

export default Star;
