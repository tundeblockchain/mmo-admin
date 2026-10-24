import { CatalogSplitPane } from '../../components/catalog/CatalogSplitPane';
import { ElementDetail } from '../../components/catalog/ElementDetail';
import { ElementEditor } from '../../components/catalog/ElementEditor';
import { ElementList } from '../../components/catalog/ElementList';
import { ResonanceDetail } from '../../components/catalog/ResonanceDetail';
import { ResonanceEditor } from '../../components/catalog/ResonanceEditor';
import { ResonanceList } from '../../components/catalog/ResonanceList';
import { StatusDetail } from '../../components/catalog/StatusDetail';
import { StatusEditor } from '../../components/catalog/StatusEditor';
import { StatusList } from '../../components/catalog/StatusList';
import { collectEntityIds, getIdValidationMessage } from '../../lib/catalogIds';
import { getEntityFieldErrors } from '../../lib/catalogValidation';
import type { ElementDefinition, ResonanceDefinition, StatusDefinition } from '../../types/catalog';
import { selectByIndexOrId } from './catalogPageUtils';
import { draftListProps, type CatalogWorkspace } from './panelShared';

export function StatusCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, statusQuery, selectedIndex, selectedEntityId, currentVersion } = workspace;
  const statuses = draft ? (draft.data as StatusDefinition[]) : statusQuery.data?.data;
  const selected = selectByIndexOrId(
    statuses,
    selectedIndex,
    selectedEntityId,
    (item) => item.statusId,
  );
  const idError =
    draft && selected
      ? getIdValidationMessage(selected.statusId, collectEntityIds(statuses ?? [], 'status'))
      : null;
  const listProps = draftListProps(workspace);

  if (draft && selected) {
    return (
      <CatalogSplitPane
        list={
          <StatusList
            statuses={statuses}
            selectedStatusId={selectedEntityId}
            onSelectStatus={workspace.handleSelectEntity}
            isLoading={false}
            error={null}
            {...listProps}
          />
        }
        detail={
          <StatusEditor
            statusData={selected}
            onUpdate={workspace.draftActions.handleUpdateStatusEntity}
            idError={idError}
            fieldErrors={getEntityFieldErrors(selected, 'status')}
          />
        }
      />
    );
  }

  return (
    <CatalogSplitPane
      list={
        <StatusList
          statuses={statuses}
          selectedStatusId={selectedEntityId}
          selectedIndex={selectedIndex}
          onSelectStatus={workspace.handleSelectEntity}
          isLoading={statusQuery.isPending && currentVersion !== null && !draft}
          error={draft ? null : statusQuery.error}
          {...listProps}
        />
      }
      detail={<StatusDetail statusData={selected} />}
    />
  );
}

export function ElementCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, elementQuery, selectedIndex, selectedEntityId, currentVersion } = workspace;
  const elements = draft ? (draft.data as ElementDefinition[]) : elementQuery.data?.data;
  const selected = selectByIndexOrId(
    elements,
    selectedIndex,
    selectedEntityId,
    (item) => item.elementId,
  );
  const idError =
    draft && selected
      ? getIdValidationMessage(selected.elementId, collectEntityIds(elements ?? [], 'element'))
      : null;
  const listProps = draftListProps(workspace);

  if (draft && selected) {
    return (
      <CatalogSplitPane
        list={
          <ElementList
            elements={elements}
            selectedElementId={selectedEntityId}
            onSelectElement={workspace.handleSelectEntity}
            isLoading={false}
            error={null}
            {...listProps}
          />
        }
        detail={
          <ElementEditor
            elementData={selected}
            onUpdate={workspace.draftActions.handleUpdateElementEntity}
            idError={idError}
            fieldErrors={getEntityFieldErrors(selected, 'element')}
          />
        }
      />
    );
  }

  return (
    <CatalogSplitPane
      list={
        <ElementList
          elements={elements}
          selectedElementId={selectedEntityId}
          selectedIndex={selectedIndex}
          onSelectElement={workspace.handleSelectEntity}
          isLoading={elementQuery.isPending && currentVersion !== null && !draft}
          error={draft ? null : elementQuery.error}
          {...listProps}
        />
      }
      detail={<ElementDetail elementData={selected} />}
    />
  );
}

export function ResonanceCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, resonanceQuery, selectedIndex, selectedEntityId, currentVersion } = workspace;
  const resonances = draft ? (draft.data as ResonanceDefinition[]) : resonanceQuery.data?.data;
  const selected = selectByIndexOrId(
    resonances,
    selectedIndex,
    selectedEntityId,
    (item) => item.resonanceId,
  );
  const idError =
    draft && selected
      ? getIdValidationMessage(selected.resonanceId, collectEntityIds(resonances ?? [], 'resonance'))
      : null;
  const listProps = draftListProps(workspace);

  if (draft && selected) {
    return (
      <CatalogSplitPane
        list={
          <ResonanceList
            resonances={resonances}
            selectedResonanceId={selectedEntityId}
            onSelectResonance={workspace.handleSelectEntity}
            isLoading={false}
            error={null}
            {...listProps}
          />
        }
        detail={
          <ResonanceEditor
            resonanceData={selected}
            onUpdate={workspace.draftActions.handleUpdateResonanceEntity}
            idError={idError}
            fieldErrors={getEntityFieldErrors(selected, 'resonance')}
          />
        }
      />
    );
  }

  return (
    <CatalogSplitPane
      list={
        <ResonanceList
          resonances={resonances}
          selectedResonanceId={selectedEntityId}
          selectedIndex={selectedIndex}
          onSelectResonance={workspace.handleSelectEntity}
          isLoading={resonanceQuery.isPending && currentVersion !== null && !draft}
          error={draft ? null : resonanceQuery.error}
          {...listProps}
        />
      }
      detail={<ResonanceDetail resonanceData={selected} />}
    />
  );
}
