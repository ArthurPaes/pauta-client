import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import VotingModal from "../../components/Voting/VotingModal";
import NewPautaModal from "../../components/NewPauta/NewPautaModal";
import { sectionApi, voteApi, type IGetAllSectionsResponse } from "../../api";
import { useSnackbar } from "../../hooks/useSnackbar.tsx";
import "./PautasList.css";

interface Pauta {
  id: number;
  name: string;
  description: string;
  expiration: number;
  hasVoted: boolean;
  totalVotes: number;
  votesTrue: number;
  votesFalse: number;
  isExpired: boolean;
}

interface UserData {
  name: string;
  email: string;
  cpf: string;
  id: number;
}

export default function PautasList() {
  const [userData] = useState<UserData>(() => {
    const data = localStorage.getItem("@UserData");
    return data ? JSON.parse(data) : { name: "", email: "", cpf: "", id: 0 };
  });
  const [openPautasArray, setOpenPautasArray] = useState<Pauta[]>([]);
  const [expiredPautasArray, setExpiredPautasArray] = useState<Pauta[]>([]);
  const [votingModal, setVotingModal] = useState<{
    open: boolean;
    pauta: Pauta | null;
  }>({ open: false, pauta: null });
  const [newPautaModal, setNewPautaModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    getAllPautas();
  }, []);

  const getAllPautas = async () => {
    setLoading(true);
    try {
      const sections = await sectionApi.getAllSections(userData.id);
      const openPautas: Pauta[] = [];
      const expiredPautas: Pauta[] = [];

      sections.forEach((section: IGetAllSectionsResponse) => {
        const pauta: Pauta = {
          id: section.id,
          name: section.name,
          description: section.description,
          expiration: section.expiration,
          hasVoted: section.hasVoted,
          totalVotes: section.totalVotes,
          votesTrue: section.votesTrue,
          votesFalse: section.votesFalse,
          isExpired: section.isExpired,
        };

        if (section.isExpired) {
          expiredPautas.push(pauta);
        } else {
          openPautas.push(pauta);
        }
      });

      setOpenPautasArray(openPautas);
      setExpiredPautasArray(expiredPautas);
    } catch (error) {
      console.error("Error fetching pautas:", error);
      showError("Erro ao carregar pautas");
    } finally {
      setLoading(false);
    }
  };

  const calculateVotes = (pauta: Pauta) => pauta.votesTrue > pauta.votesFalse;

  const handleCreateNewPauta = async (
    newPauta: { name: string; description: string; expiration: number } | null,
  ) => {
    console.log("userdata dentro do handleCreateNewPauta: ", userData);
    setNewPautaModal(false);
    if (newPauta) {
      try {
        await sectionApi.createSection(newPauta);
        showSuccess("Pauta criada com sucesso!");
        getAllPautas();
      } catch (error) {
        showError("Erro ao criar pauta");
      }
    }
  };

  const handleVoteOnPauta = async (vote: boolean | undefined) => {
    if (votingModal.pauta && vote !== undefined) {
      try {
        await voteApi.voteOnSection({
          sectionId: votingModal.pauta.id,
          userId: userData.id,
          vote: vote,
        });
        showSuccess("Voto computado com sucesso!");
        getAllPautas();
      } catch (error: any) {
        showError(
          error?.response?.data?.message ||
            error?.message ||
            "Erro ao computar voto",
        );
      }
    }
    setVotingModal({ open: false, pauta: null });
  };

  const handleLogOut = () => {
    localStorage.removeItem("@UserData");
    window.location.href = "/login";
  };

  return (
    <div className="pautas-list-bg">
      <div className="pautas-list-header">
        <div className="pautas-list-user">
          <span>Nome de Usuário: {userData.name}</span>
          <span>Email: {userData.email}</span>
          <Button
            className="pautas-list-logout-btn"
            variant="contained"
            onClick={handleLogOut}
          >
            Sair
          </Button>
        </div>
      </div>
      <Button
        className="pautas-list-create-btn"
        variant="contained"
        onClick={() => setNewPautaModal(true)}
        style={{ margin: "0 auto 32px auto", display: "block" }}
      >
        + Criar uma nova pauta
      </Button>
      <div className="pautas-list-main">
        {loading ? (
          <Box style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '48px 0' }}>
            <CircularProgress size={56} style={{ color: '#6a82fb' }} />
          </Box>
        ) : (
          <>
        <div className="pautas-list-section">
          <span className="pautas-list-title">Pautas abertas</span>
          {openPautasArray.length <= 0 && (
            <div className="pautas-list-empty">
              Não existem pautas abertas. Crie uma
            </div>
          )}
          {openPautasArray.map(
            (pauta) =>
              !pauta.isExpired && (
                <div key={pauta.id} className="pauta-block">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        color: "#232946",
                      }}
                    >{`Pauta: ${pauta.name}`}</Typography>
                  </div>
                  <div className="description-container">
                    <Typography className="description-label">
                      Descrição:
                    </Typography>
                    <Typography className="pauta-description">
                      {pauta.description}
                    </Typography>
                  </div>
                  <div className="open-pautas-footer">
                    <Chip label={`Duração: ${pauta.expiration}min`} />
                    <Button
                      className="pautas-list-create-btn"
                      variant="contained"
                      onClick={() => setVotingModal({ open: true, pauta })}
                    >
                      Votar
                    </Button>
                  </div>
                </div>
              ),
          )}
        </div>
        <div className="pautas-list-section">
          <span className="pautas-list-title">Pautas Encerradas</span>
          {expiredPautasArray.map(
            (pauta) =>
              pauta.isExpired && (
                <div key={pauta.id} className="pauta-block">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        color: "#232946",
                      }}
                    >{`Pauta: ${pauta.name}`}</Typography>
                  </div>
                  <div className="description-container">
                    <Typography className="description-label">
                      Descrição:
                    </Typography>
                    <Typography className="pauta-description">
                      {pauta.description}
                    </Typography>
                  </div>
                  <div className="open-pautas-footer">
                    <div>
                      <Chip
                        label={
                          calculateVotes(pauta) ? "Aprovada" : "Não Aprovada"
                        }
                        style={{
                          backgroundColor: calculateVotes(pauta)
                            ? "rgb(203, 228, 203)"
                            : "rgb(255, 183, 183)",
                        }}
                      />
                    </div>
                    <div className="vote-counter-container">
                      <Chip label={`Votos sim: ${pauta.votesTrue}`} />
                      <Chip label={`Votos não: ${pauta.votesFalse}`} />
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
          </>
        )}
      </div>
      <VotingModal
        open={votingModal.open}
        pauta={votingModal.pauta || { name: "", description: "" }}
        onClose={handleVoteOnPauta}
      />
      <NewPautaModal open={newPautaModal} onClose={handleCreateNewPauta} />
    </div>
  );
}
