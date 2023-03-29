import styled from "@emotion/styled";
import axios from "axios";
import { Spacer, Spinner } from "../components";
import useForm from "../hooks/useForm";
import { useNavigate } from 'react-router-dom';
const PageWrapper = styled.div`
`;

const Title = styled.h2`
    display: block;
    margin-top: 0px;
    padding-top: 12px;
    padding-left: 8px;
`;

const FormBox = styled.form`
    position: flex;
    width: 80%;
    margin: 0 10%;
    padding: 8px 16px;
    background-color: white;
    text-align: center;
    border-radius: 16px;

    box-sizing: border-box;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
`;

const InputContainer = styled.div`
    margin-top: 30px;
`;
const Label = styled.div`

`;
const Input = styled.input`
    border: 0px;
    border-bottom: 0.5px solid black;

    &:focus {
        outline: none;
    }

`;
const LinkButton = styled.button`
    background-color: #FFE2EA;
    border-radius: 4px;
    border: 0px;
    padding: 10px;
    width: 200px;
    height: 80px;
    font-size: 20px;
    font-weight: bold;

    &:hover {
        cursor: pointer
    }
`

const StyledInput = styled.input`
  padding: 0.5em;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 1.2rem;
  background-color: #f2f2f2;
  color: #333;
  text-align: center;

  // input date를 위한 css 요소 이후에 다른 형식으로 변경되면 삭제
  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
    margin-right: 0.5rem;
  }
`;

const ErrorMessage = styled.span`
    display: flex;
    color: red;
    
`;

export default function CreateRoom() {
    const navigate = useNavigate();

    const { isLoading, errors, handleChange, handleSubmit } = useForm({
        initialState: {
            roomName: '',
            roomBirthdate: '',
            roomEmail: ''
        },
        onSubmit: async ({ roomName, roomBirthdate, roomEmail }) => {
            try {
                const res = await axios.post('/new-room', null, {
                    params: {
                        roomName,
                        roomBirthdate,
                        roomEmail
                    }
                });

                if (res.status === 200) {
                    navigate(`/GiftRoom/${res.data}`);
                }
                else {
                    throw new Error(`방 생성 api 오류 Status ${res.status}`);   // 방 5회 이상 생겼을 경우
                }
            } catch (e) {
                console.error(e);
            }
        },
        validate: ({ roomName, roomEmail, roomBirthdate }) => {
            const errors = {};
            if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(roomEmail)) errors.roomEmail = '올바른 이메일을 입력해주세요.'; // @o.cnu.ac.kr 같은 이메일은 통과가 안되니 수정필요
            if (!roomName) errors.roomName = '방 이름을 입력해주세요.';
            if (!roomBirthdate) errors.roomBirthdate = '생일을 입력해주세요.';
            return errors;
        }
    });
    return (
        <PageWrapper>
            <Title>생일빵: Brithday Postbox</Title>
            <FormBox onSubmit={handleSubmit}>
                <Spacer type="vertical">
                    <h1>새로운 방 생성하기</h1>
                    <InputContainer>
                        <Label>방 이름</Label>
                        <Input
                        name="roomName"
                        type="text"
                        placeholder="방 이름을 입력해주세요."
                        onChange={handleChange}
                        />
                        <ErrorMessage>{errors.roomName}</ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                        <Label>생일을 입력해주세요.</Label>
                        <StyledInput
                        name="roomBirthdate"
                        type="date"
                        min="1900-01-01"
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={handleChange}
                        />
                        <ErrorMessage>{errors.roomBirthdate}</ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                        <Label>이메일을 입력해주세요. </Label>
                        <Input
                        name="roomEmail"
                        type="email"
                        label="선물을 받음 사람의 이메일을 입력해주세요."
                        placeholder=""
                        onChange={handleChange}
                        />
                        <ErrorMessage>{errors.roomEmail}</ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                        <LinkButton type="submit" disabled={isLoading}>{isLoading ? <Spinner /> : '링크 생성하기' }</LinkButton>
                    </InputContainer>
                </Spacer>
            </FormBox>
        </PageWrapper>
    );
}