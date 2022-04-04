import { useState } from "react";

import { Row,Col } from "antd";
import cn from "classnames/bind";
import styles from "./Item.module.scss";
const cx = cn.bind(styles);
const Item = ({listToken, setListToken,rowItem, idx}) => {
    const [info, setInfo] = useState({
        tokenId: "",
        supply: 0,
        
    })
    const [deleted, setDeleted] = useState(false);
    const handleChange = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
        // if((listToken.find(x => x.tokenId === info.tokenId) === undefined)){
        //     console.log("push1")
        //     const newList = [...listToken]
        //     newList.push({...info, [e.target.name]: e.target.value} )
        //     setListToken(newList)
        // }else{
            
        //     let token = listToken.find(x => x.tokenId === info.tokenId);
        //     if(token){
        //         console.log("replace")
        //         token[e.target.name] = e.target.value;
        //         let newList = listToken.map((item) => {
        //             if(item.tokenId === token.tokenId){
        //                 item = token;
        //             }
        //             return item;
        //         })
        //         setListToken(newList)
        //     }else{
        //         console.log("push2")
        //         let newToken;
        //         newToken[e.target.name] = e.target.value;
        //         setListToken([...listToken, newToken])
        //     }
        
       
            
        // }
        const newToken = {...info,
            [e.target.name]: e.target.value};
            const newList = [...listToken];
            if(idx > listToken.length - 1){
                // push
                newList.push(newToken);
                setListToken(newList);
            }else{
                for(let i = 0; i < listToken.length; i++){
                    newList[idx] = newToken;
                }
                setListToken(newList);
            }
        
    }
    const deleteToken = () => {
        let index = listToken.findIndex(x => x.tokenId === info.tokenId);
        let newList = [...listToken];
        newList.splice(index, index);
        setDeleted(true)
        setListToken(newList)
    }
    return(
        !deleted && <Row className={cx("modal-table-item")}>
        <Col span={10}>
            <input 
            name="tokenId"
            value={info.tokenId} 
            onChange={handleChange}/>
        </Col>
        <Col span={10}>
            <input 
            name="supply"
            value={info.supply} 
            onChange={handleChange}/>
        </Col>
        <Col span={3} onClick={deleteToken}>X</Col>
      </Row>
    )
}
export default Item;