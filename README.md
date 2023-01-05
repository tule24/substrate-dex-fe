# Substrate dex orderbook FE

React + Redux Toolkit + Tailwind + @Polkadot

### `npm i`
Install dependencies in package.json

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `./src/utils/utils.ts`
Set up provider, wallet, extension

### `./view/`
#### `Admin` : Chứa nội dung trang admin gồm các tab `issue token`, `transfer token`, `create tradepair`
#### `Exchange` : Chứa nội dung trang exchange gồm orderbook và form order
#### `Header` : Tab header chứa thông tin wallet, bảng chọn cặp Tradepair
#### `utils` : Set up cái hiển thị thông báo


## Code
Khi start web thì các func sau sẽ khởi chạy:
#### `./src/view/Header/index.ts`
#### Gọi API kết nối với node
![Image](https://i.imgur.com/z2GyVGz.png)

#### Kết nối với wallet => polkadot wallet
![Image](https://i.imgur.com/WqAZccd.png)

#### Hàm lắng nghe event được emit từ node, nó sẽ lắng nghe liên tục đến khi nào tắt node thì thôi [Link tham khảo](https://polkadot.js.org/docs/api/examples/promise/system-events)
Ở đây sẽ lắng nghe và check event rồi cập nhật lại data cho fe
![Image](https://i.imgur.com/qe6nN7Z.png)

### Phần tương tác FE với node chỉ có call extrinsic và get dữ liệu từ blockchain
#### Get dữ liệu thì do mình xài StorageMap nên mình có thể get 1 giá trị hoặc toàn bộ giá trị của map [Link tham khảo](https://polkadot.js.org/docs/api/start/api.query.other#map-keys-entries)
#### `./src/store/reducer/trade.reducer.ts`
- Get 1 giá trị tương ứng với 1 key mình truyền vào
![Image](https://i.imgur.com/GzMLury.png)
- Get toàn bộ giá trị của map đó
![Image](https://i.imgur.com/kXuzvrI.png)

#### Call extrinsic thì mình dùng address wallet của mình để sign và send extrinsic đó, nếu nó bắn ra DispatchError là fail còn ko là success
#### `./src/view/Admin/components/CreateTradepair.tsx`
![Image](https://i.imgur.com/UPDBTqT.png)




