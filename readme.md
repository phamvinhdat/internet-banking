# Internet banking

Giới thiệu

    Đồ án môn học: `Phát triển ứng dụng web nâng cao`

Sinh viên thực hiện:

| Mã số sinh viên | Họ và tên | Email 
|---|---|---
|1612091|Phạm Vĩnh Đạt|phamvinhdat1998@gmail.com
|1612234|Trần Quốc Hưng|

## Liên kết ngân hàng

- Mỗi ngân hàng khi liên kết sẽ được cấp 2 thứ:

    - Public key: dùng để nén thông tin trao đổi, sau khi nén thông tin gọi là x
    - Secret key: mã hóa một chiều, dùng để mã hóa x, mục đích để xác thực và đảm bảo tính toàn vẹn của x

- Các api luôn liên kết luôn có hai field:

|#| field | type | required |  Description
|---|---|--- | --- | ---
| 1 | payload | object | x | Chứa thông tin, là mã hóa của của public key và data cần gửi (data mô tả ở api)
| 2 | signature | string | x | Chữ kí số, HMACSHA512 của `payload` và `secret key`

### API lấy thông tin khách hàng

- URL: https://yasuobank.herokuapp.com/api/v1/associate-bank/{bank_code}/account-info
- Method: POST
- Data:

|#| field | type | required |  Description
|---|---|--- | --- | ---
|1| account_number|int|x|Số tài khoản của khách hàng

### API chuyển tiền

- URL: https://yasuobank.herokuapp.com/api/v1/associate-bank/{bank_code}/transfer
- Method: POST
- Data:

|#| field | type | required |  Description
|---|---|--- | --- | ---
|1|account_number|int|x|Số tài khoản của khách hàng
|2|value|uint|x|Số tiền chuyển
