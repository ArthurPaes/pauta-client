import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Icon from '../../components/Icon';
import PautaCard, { type PautaModel } from '../../components/PautaCard';
import VotingModal from '../../components/modals/VotingModal';
import PautaFormModal, { type PautaFormData } from '../../components/modals/PautaFormModal';
import AddUsersModal, { type SelectableUser } from '../../components/modals/AddUsersModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { usePautas } from '../../hooks/usePautas';
import { useSnackbar } from '../../hooks/useSnackbar';
import { sectionApi, voteApi, userApi } from '../../api';
import type { UserData } from '../../components/Layout/AppLayout';

interface PautasProps {
  readonly filter?: 'all' | 'mine' | 'voted';
}

function emptyMessage(search: string, tab: 'open' | 'closed'): string {
  if (search) return 'Nenhuma pauta encontrada.';
  if (tab === 'open') return 'Nenhuma pauta aberta.';
  return 'Nenhuma pauta encerrada.';
}

export default function Pautas({ filter = 'all' }: PautasProps) {
  const { user } = useOutletContext<{ user: UserData }>();
  const { pautas, loading, refresh } = usePautas(user.id);
  const { showSuccess, showError } = useSnackbar();

  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState<'open' | 'closed'>('open');
  const [voting, setVoting]     = useState<PautaModel | null>(null);
  const [editing, setEditing]   = useState<PautaModel | null>(null);
  const [removing, setRemoving] = useState<PautaModel | null>(null);
  const [usersFor, setUsersFor] = useState<PautaModel | null>(null);
  const [creating, setCreating] = useState(false);
  const [allUsers, setAllUsers] = useState<SelectableUser[]>([]);

  useEffect(() => {
    if (usersFor) {
      userApi.getAllUsers(user.id)
        .then(users => setAllUsers(users.map(u => ({ id: u.id, name: u.name, email: u.email }))))
        .catch(() => setAllUsers([]));
    }
  }, [usersFor, user.id]);

  const filtered = useMemo(() => {
    let list = pautas;
    if (filter === 'mine')  list = list.filter(p => p.ownerId === user.id);
    if (filter === 'voted') list = list.filter(p => p.hasVoted);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [pautas, filter, search, user.id]);

  const open   = filtered.filter(p => !p.isExpired);
  const closed = filtered.filter(p => p.isExpired);
  const shown  = tab === 'open' ? open : closed;

  const handleVoteDone = async (vote: boolean | undefined) => {
    if (vote !== undefined && voting) {
      try {
        await voteApi.voteOnSection({ sectionId: voting.id, userId: user.id, vote });
        showSuccess(`Voto "${vote ? 'Sim' : 'Não'}" computado com sucesso!`);
        await refresh();
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Erro ao computar voto');
      }
    }
    setVoting(null);
  };

  const handleCreateDone = async (data: PautaFormData | null) => {
    setCreating(false);
    if (!data) return;
    try {
      await sectionApi.createSection({ ...data, userId: user.id });
      showSuccess('Pauta criada com sucesso!');
      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao criar pauta');
    }
  };

  const handleEditDone = async (data: PautaFormData | null) => {
    if (data && editing) {
      try {
        await sectionApi.updateSection(editing.id, data);
        showSuccess('Pauta atualizada com sucesso!');
        await refresh();
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Erro ao atualizar pauta');
      }
    }
    setEditing(null);
  };

  const handleDeleteConfirm = async () => {
    if (removing) {
      try {
        await sectionApi.deleteSection(removing.id);
        showSuccess('Pauta excluída com sucesso!');
        await refresh();
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Erro ao excluir pauta');
      }
    }
    setRemoving(null);
  };

  const handleAddUsersDone = async (selected: number[] | null) => {
    if (selected !== null && usersFor) {
      try {
        await sectionApi.updateSectionUsers(usersFor.id, { userIds: selected });
        showSuccess('Usuários atualizados com sucesso!');
        await refresh();
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Erro ao atualizar usuários');
      }
    }
    setUsersFor(null);
  };

  const showCreateButton = filter !== 'voted';

  return (
    <div className="pautas-page">
      <div className="pautas-toolbar">
        <div className="search-wrap">
          <span className="search-icon"><Icon name="search" size={16} /></span>
          <input
            className="search-input"
            placeholder="Buscar pautas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {showCreateButton && (
          <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={16} /> Nova Pauta
          </button>
        )}
      </div>

      <div className="tab-bar">
        <button
          type="button"
          className={`tab-btn${tab === 'open' ? ' active' : ''}`}
          onClick={() => setTab('open')}
        >
          Abertas <span className="tab-count">{open.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn${tab === 'closed' ? ' active' : ''}`}
          onClick={() => setTab('closed')}
        >
          Encerradas <span className="tab-count">{closed.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="spinner" style={{ borderColor: 'var(--surface-3)', borderTopColor: 'var(--accent)' }}></span>
          <p>Carregando pautas...</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty-state">
          <Icon name="file" size={40} />
          <p>{emptyMessage(search, tab)}</p>
        </div>
      ) : (
        <div className="pautas-grid">
          {shown.map(p => (
            <PautaCard
              key={p.id}
              pauta={p}
              userId={user.id}
              onVote={setVoting}
              onEdit={setEditing}
              onDelete={setRemoving}
              onAddUsers={setUsersFor}
            />
          ))}
        </div>
      )}

      {voting && <VotingModal pauta={voting} onClose={handleVoteDone} />}
      {creating && <PautaFormModal mode="create" onClose={handleCreateDone} />}
      {editing && (
        <PautaFormModal
          mode="edit"
          initial={{ name: editing.name, description: editing.description, expiration: editing.expiration }}
          onClose={handleEditDone}
        />
      )}
      {removing && (
        <ConfirmModal
          title="Excluir pauta"
          message={`Tem certeza que deseja excluir "${removing.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setRemoving(null)}
        />
      )}
      {usersFor && (
        <AddUsersModal
          allUsers={allUsers}
          initialSelected={usersFor.allowedUsers ?? []}
          onClose={handleAddUsersDone}
        />
      )}
    </div>
  );
}
