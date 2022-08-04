import { css } from "@emotion/css";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextareaAutosize } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import board from "../../images/board.svg";
import greenface from "../../images/greenface.svg";

interface CreateTeamModalProps {
  setShowModal: (showModal: boolean) => void;
}

const CreateTeam = styled.div`
  z-index: 4;
  background-color: white;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 925px;

  display: flex;
`;

const CreateTeamForm = styled.div`
  flex: 1;
  padding: 3em 0 3em 3em;
`;

const CreateTeamBg = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.3em;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.75em;
`;

const SubTitle = styled.p`
color: #838282
margin-bottom: 1.5em;
`;

const faceImg = css`
  position: absolute;
  transition: all 100ms ease;

  &--1 {
    left: -100px;
    top: 460px;
  }
`;

const fal = css`
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 1.25rem;
`;

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ setShowModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const nameValue: String = watch("name", "");

  const onSubmit = (data: any) => {
    console.log(data);
    setShowModal(false);
  };

  return (
    <CreateTeam>
      <CreateTeamForm>
        <Title>Start a Project</Title>
        <SubTitle>
          Boost your productivity by making it easier for everyone to access
          boards in one location.
        </SubTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label>Project Name</Label>
          <TextareaAutosize
            name="name"
            // ref={register({ required: true })}
            required
            placeholder="The Boys"
            style={{
              padding: "0.5em",
              width: "80%",
              marginBottom: "1em",
              resize: "none",
            }}
          />
          <Label>Project Description</Label>
          <TextareaAutosize
            name="description"
            // ref={register}
            placeholder="Get your members on board with a few words about your project"
            style={{
              resize: "none",
              width: "80%",
              height: "100px",
              padding: "0.5em",
              marginBottom: "1em",
            }}
          />

          <Label>Invite Members</Label>
          <TextareaAutosize
            name="members"
            // ref={register}
            placeholder="Type in username or email"
            style={{
              padding: "0.5em",
              width: "80%",
              marginBottom: "1em",
              resize: "none",
            }}
          />
          {nameValue.trim() !== "" ? (
            <Button
              variant="contained"
              color="primary"
              style={{
                display: "block",
                width: "83.5%",
                textAlign: "center",
                padding: "0.85em 2em",
                borderRadius: "3px",
              }}
            >
              Create Project
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              disabled
              style={{
                display: "block",
                width: "83.5%",
                textAlign: "center",
                padding: "0.85em 2em",
                borderRadius: "3px",
              }}
            >
              Create Project
            </Button>
          )}
        </form>
      </CreateTeamForm>
      <CreateTeamBg>
        <Button onClick={() => setShowModal(false)}>
          <CloseIcon className={fal} />
        </Button>
        <Image
          src={board}
          alt="board"
          width={400}
          height={500}
          style={{ margin: "0 auto", marginTop: "40px" }}
        />
        <Image
          src={greenface}
          alt="face"
          className={faceImg}
          height={70}
          width={70}
        />
      </CreateTeamBg>
    </CreateTeam>
  );
};

export default CreateTeamModal;
