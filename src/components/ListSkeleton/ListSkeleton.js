import React from "react";
import CardSkeleton from "./CardSkeleton";
const mockData = [1, 2, 3, 4, 5, 6];
const ListSkeleton = () => {
    return(<>
        {mockData.map((item) => <CardSkeleton key={"cardSkeleton-" + item}/>)}
    </>)
}
export default  React.memo(ListSkeleton);