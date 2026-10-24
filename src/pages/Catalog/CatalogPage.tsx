import { useState, useCallback } from 'react';
import { Box, Grid, Paper, Typography, Alert, Snackbar } from '@mui/material';
import { CatalogTypeNav } from '../../components/catalog/CatalogTypeNav';
import { VersionPicker } from '../../components/catalog/VersionPicker';
import { ClassList } from '../../components/catalog/ClassList';
import { ClassDetail } from '../../components/catalog/ClassDetail';
import { ClassEditor } from '../../components/catalog/ClassEditor';
import { SkillList } from '../../components/catalog/SkillList';
import { SkillDetail } from '../../components/catalog/SkillDetail';
import { SkillEditor } from '../../components/catalog/SkillEditor';
import { StatusList } from '../../components/catalog/StatusList';
import { StatusDetail } from '../../components/catalog/StatusDetail';
import { StatusEditor } from '../../components/catalog/StatusEditor';
import { ElementList } from '../../components/catalog/ElementList';
import { ElementDetail } from '../../components/catalog/ElementDetail';
import { ElementEditor } from '../../components/catalog/ElementEditor';
import { ResonanceList } from '../../components/catalog/ResonanceList';
import { ResonanceDetail } from '../../components/catalog/ResonanceDetail';
import { ResonanceEditor } from '../../components/catalog/ResonanceEditor';
import { CombatConstantsDetail } from '../../components/catalog/CombatConstantsDetail';
import { CombatConstantsEditor } from '../../components/catalog/CombatConstantsEditor';
import { DraftToolbar } from '../../components/catalog/DraftToolbar';
import { PublishDialog } from '../../components/catalog/PublishDialog';
import { ConfirmDeleteDialog } from '../../components/catalog/ConfirmDeleteDialog';
import { useCatalogVersions } from '../../hooks/useCatalogVersions';
import {
  useClassCatalog,
  useSkillCatalog,
  useStatusCatalog,
  useElementCatalog,
  useResonanceCatalog,
  useCombatConstantsCatalog,
} from '../../hooks/useCatalogData';
import {
  useDraft,
  useCreateDraft,
  useDiscardDraft,
  updateDraft,
} from '../../hooks/useDraftCatalog';
import { usePublishCatalog } from '../../hooks/usePublishCatalog';
import {
  createDefaultClass,
  createDefaultSkill,
  createDefaultStatus,
  createDefaultElement,
  createDefaultResonance,
} from '../../lib/catalogDefaults';
import {
  collectEntityIds,
  draftHasInvalidIds,
  getIdValidationMessage,
} from '../../lib/catalogIds';
import type {
  CatalogType,
  ClassDefinition,
  SkillDefinition,
  StatusDefinition,
  ElementDefinition,
  ResonanceDefinition,
  CombatConstantsData,
  CatalogEntityData,
} from '../../types/catalog';

interface VersionSelections {
  class: number | null;
  skill: number | null;
  'combat-constants': number | null;
  status: number | null;
  element: number | null;
  resonance: number | null;
}

interface PendingDelete {
  index: number;
  displayName: string;
  kindLabel: string;
}

function entityKindLabel(type: CatalogType): string {
  switch (type) {
    case 'class':
      return 'class';
    case 'skill':
      return 'skill';
    case 'status':
      return 'status';
    case 'element':
      return 'element';
    case 'resonance':
      return 'resonance';
    case 'combat-constants':
      return 'combat constants';
  }
}

function selectByIndexOrId<T>(
  items: T[] | undefined,
  selectedIndex: number | null,
  selectedId: string | null,
  getId: (item: T) => string,
): T | null {
  if (!items) {
    return null;
  }
  if (selectedIndex !== null) {
    return items[selectedIndex] ?? null;
  }
  return items.find((item) => getId(item) === selectedId) ?? null;
}

export function CatalogPage() {
  const [selectedType, setSelectedType] = useState<CatalogType>('class');
  const [versions, setVersions] = useState<VersionSelections>({
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState<string | null>(null);

  const {
    data: versionData,
    isPending: versionsLoading,
    error: versionsError,
  } = useCatalogVersions();

  const classQuery = useClassCatalog(versions.class);
  const skillQuery = useSkillCatalog(versions.skill);
  const statusQuery = useStatusCatalog(versions.status);
  const elementQuery = useElementCatalog(versions.element);
  const resonanceQuery = useResonanceCatalog(versions.resonance);
  const combatConstantsQuery = useCombatConstantsCatalog(versions['combat-constants']);

  const draft = useDraft(selectedType);
  const createDraft = useCreateDraft();
  const discardDraft = useDiscardDraft();
  const {
    publish,
    isPending: isPublishing,
    error: publishError,
    isConflictError,
    isAuthError,
    reset: resetPublishError,
  } = usePublishCatalog();

  const handleTypeChange = useCallback((type: CatalogType) => {
    setSelectedType(type);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    setPendingDelete(null);
  }, []);

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setVersions((prev) => ({ ...prev, [type]: version }));
    setSelectedEntityId(null);
    setSelectedIndex(null);
  }, []);

  const handleSelectEntity = useCallback((id: string, index: number) => {
    setSelectedEntityId(id);
    setSelectedIndex(index);
  }, []);

  const handleCreateDraft = useCallback(() => {
    const currentVersion = versions[selectedType];
    if (currentVersion === null) return;

    let data: CatalogEntityData | undefined;
    switch (selectedType) {
      case 'class':
        data = classQuery.data?.data;
        break;
      case 'skill':
        data = skillQuery.data?.data;
        break;
      case 'status':
        data = statusQuery.data?.data;
        break;
      case 'element':
        data = elementQuery.data?.data;
        break;
      case 'resonance':
        data = resonanceQuery.data?.data;
        break;
      case 'combat-constants':
        data = combatConstantsQuery.data?.data;
        break;
    }

    if (data) {
      createDraft(selectedType, currentVersion, data);
    }
  }, [
    selectedType,
    versions,
    classQuery.data,
    skillQuery.data,
    statusQuery.data,
    elementQuery.data,
    resonanceQuery.data,
    combatConstantsQuery.data,
    createDraft,
  ]);

  const handleDiscardDraft = useCallback(() => {
    discardDraft(selectedType);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    setPendingDelete(null);
  }, [selectedType, discardDraft]);

  const handleOpenPublish = useCallback(() => {
    resetPublishError();
    setPublishDialogOpen(true);
  }, [resetPublishError]);

  const handleClosePublish = useCallback(() => {
    setPublishDialogOpen(false);
  }, []);

  const handlePublish = useCallback(
    async (releaseNotes: string) => {
      if (!draft) return;

      const result = await publish({
        catalogType: selectedType,
        request: {
          data: draft.data,
          releaseNotes: releaseNotes || undefined,
        },
      });

      setPublishDialogOpen(false);
      discardDraft(selectedType);
      setSelectedEntityId(null);
      setSelectedIndex(null);
      setSuccessSnackbar(`Published ${selectedType} v${result.version}`);
    },
    [draft, selectedType, publish, discardDraft],
  );

  const handleCloseSnackbar = useCallback(() => {
    setSuccessSnackbar(null);
  }, []);

  const handleUpdateClassEntity = useCallback(
    (updated: ClassDefinition) => {
      if (!draft || selectedType !== 'class' || selectedIndex === null) return;
      const classes = draft.data as ClassDefinition[];
      const updatedClasses = classes.map((item, index) =>
        index === selectedIndex ? updated : item,
      );
      updateDraft('class', updatedClasses);
      setSelectedEntityId(updated.classId);
    },
    [draft, selectedType, selectedIndex],
  );

  const handleUpdateCombatConstants = useCallback(
    (updated: CombatConstantsData) => {
      if (!draft || selectedType !== 'combat-constants') return;
      updateDraft('combat-constants', updated);
    },
    [draft, selectedType],
  );

  const handleUpdateSkillEntity = useCallback(
    (updated: SkillDefinition) => {
      if (!draft || selectedType !== 'skill' || selectedIndex === null) return;
      const skills = draft.data as SkillDefinition[];
      const updatedSkills = skills.map((item, index) =>
        index === selectedIndex ? updated : item,
      );
      updateDraft('skill', updatedSkills);
      setSelectedEntityId(updated.skillId);
    },
    [draft, selectedType, selectedIndex],
  );

  const handleUpdateStatusEntity = useCallback(
    (updated: StatusDefinition) => {
      if (!draft || selectedType !== 'status' || selectedIndex === null) return;
      const statuses = draft.data as StatusDefinition[];
      const updatedStatuses = statuses.map((item, index) =>
        index === selectedIndex ? updated : item,
      );
      updateDraft('status', updatedStatuses);
      setSelectedEntityId(updated.statusId);
    },
    [draft, selectedType, selectedIndex],
  );

  const handleUpdateElementEntity = useCallback(
    (updated: ElementDefinition) => {
      if (!draft || selectedType !== 'element' || selectedIndex === null) return;
      const elements = draft.data as ElementDefinition[];
      const updatedElements = elements.map((item, index) =>
        index === selectedIndex ? updated : item,
      );
      updateDraft('element', updatedElements);
      setSelectedEntityId(updated.elementId);
    },
    [draft, selectedType, selectedIndex],
  );

  const handleUpdateResonanceEntity = useCallback(
    (updated: ResonanceDefinition) => {
      if (!draft || selectedType !== 'resonance' || selectedIndex === null) return;
      const resonances = draft.data as ResonanceDefinition[];
      const updatedResonances = resonances.map((item, index) =>
        index === selectedIndex ? updated : item,
      );
      updateDraft('resonance', updatedResonances);
      setSelectedEntityId(updated.resonanceId);
    },
    [draft, selectedType, selectedIndex],
  );

  const handleAddEntity = useCallback(() => {
    if (!draft || selectedType === 'combat-constants') return;

    switch (selectedType) {
      case 'class': {
        const next = [...(draft.data as ClassDefinition[]), createDefaultClass()];
        updateDraft('class', next);
        setSelectedIndex(next.length - 1);
        setSelectedEntityId(next[next.length - 1].classId);
        break;
      }
      case 'skill': {
        const next = [...(draft.data as SkillDefinition[]), createDefaultSkill()];
        updateDraft('skill', next);
        setSelectedIndex(next.length - 1);
        setSelectedEntityId(next[next.length - 1].skillId);
        break;
      }
      case 'status': {
        const next = [...(draft.data as StatusDefinition[]), createDefaultStatus()];
        updateDraft('status', next);
        setSelectedIndex(next.length - 1);
        setSelectedEntityId(next[next.length - 1].statusId);
        break;
      }
      case 'element': {
        const next = [...(draft.data as ElementDefinition[]), createDefaultElement()];
        updateDraft('element', next);
        setSelectedIndex(next.length - 1);
        setSelectedEntityId(next[next.length - 1].elementId);
        break;
      }
      case 'resonance': {
        const next = [...(draft.data as ResonanceDefinition[]), createDefaultResonance()];
        updateDraft('resonance', next);
        setSelectedIndex(next.length - 1);
        setSelectedEntityId(next[next.length - 1].resonanceId);
        break;
      }
    }
  }, [draft, selectedType]);

  const handleRequestDelete = useCallback(
    (_id: string, index: number, displayName: string) => {
      setPendingDelete({
        index,
        displayName,
        kindLabel: entityKindLabel(selectedType),
      });
    },
    [selectedType],
  );

  const handleCancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!draft || pendingDelete === null || selectedType === 'combat-constants') return;

    const { index } = pendingDelete;

    switch (selectedType) {
      case 'class':
        updateDraft(
          'class',
          (draft.data as ClassDefinition[]).filter((_, itemIndex) => itemIndex !== index),
        );
        break;
      case 'skill':
        updateDraft(
          'skill',
          (draft.data as SkillDefinition[]).filter((_, itemIndex) => itemIndex !== index),
        );
        break;
      case 'status':
        updateDraft(
          'status',
          (draft.data as StatusDefinition[]).filter((_, itemIndex) => itemIndex !== index),
        );
        break;
      case 'element':
        updateDraft(
          'element',
          (draft.data as ElementDefinition[]).filter((_, itemIndex) => itemIndex !== index),
        );
        break;
      case 'resonance':
        updateDraft(
          'resonance',
          (draft.data as ResonanceDefinition[]).filter((_, itemIndex) => itemIndex !== index),
        );
        break;
    }

    setSelectedEntityId(null);
    setSelectedIndex(null);
    setPendingDelete(null);
  }, [draft, pendingDelete, selectedType]);

  const allVersions = versionData?.versions ?? [];
  const currentVersion = versions[selectedType];
  const hasInvalidIds = draft ? draftHasInvalidIds(draft.data, selectedType) : false;

  const getOriginalData = (): CatalogEntityData | undefined => {
    switch (selectedType) {
      case 'class':
        return classQuery.data?.data;
      case 'skill':
        return skillQuery.data?.data;
      case 'status':
        return statusQuery.data?.data;
      case 'element':
        return elementQuery.data?.data;
      case 'resonance':
        return resonanceQuery.data?.data;
      case 'combat-constants':
        return combatConstantsQuery.data?.data;
    }
  };

  const draftListProps = draft
    ? {
        isDraft: true,
        selectedIndex,
        onAdd: handleAddEntity,
        onRequestDelete: handleRequestDelete,
      }
    : {};

  const renderEntityContent = () => {
    switch (selectedType) {
      case 'class': {
        const classes = draft
          ? (draft.data as ClassDefinition[])
          : classQuery.data?.data;
        const selectedClass = selectByIndexOrId(
          classes,
          selectedIndex,
          selectedEntityId,
          (item) => item.classId,
        );
        const idError =
          draft && selectedClass
            ? getIdValidationMessage(selectedClass.classId, collectEntityIds(classes ?? [], 'class'))
            : null;

        if (draft && selectedClass) {
          return (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                  <ClassList
                    classes={classes}
                    selectedClassId={selectedEntityId}
                    onSelectClass={handleSelectEntity}
                    isLoading={false}
                    error={null}
                    {...draftListProps}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ClassEditor
                  classData={selectedClass}
                  onUpdate={handleUpdateClassEntity}
                  idError={idError}
                />
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ClassList
                  classes={classes}
                  selectedClassId={selectedEntityId}
                  selectedIndex={selectedIndex}
                  onSelectClass={handleSelectEntity}
                  isLoading={classQuery.isPending && currentVersion !== null}
                  error={classQuery.error}
                  {...draftListProps}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ClassDetail classData={selectedClass} />
            </Grid>
          </Grid>
        );
      }

      case 'skill': {
        const skills = draft
          ? (draft.data as SkillDefinition[])
          : skillQuery.data?.data;
        const selectedSkill = selectByIndexOrId(
          skills,
          selectedIndex,
          selectedEntityId,
          (item) => item.skillId,
        );
        const idError =
          draft && selectedSkill
            ? getIdValidationMessage(selectedSkill.skillId, collectEntityIds(skills ?? [], 'skill'))
            : null;

        if (draft && selectedSkill) {
          return (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                  <SkillList
                    skills={skills}
                    selectedSkillId={selectedEntityId}
                    onSelectSkill={handleSelectEntity}
                    isLoading={false}
                    error={null}
                    {...draftListProps}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <SkillEditor
                  skillData={selectedSkill}
                  onUpdate={handleUpdateSkillEntity}
                  idError={idError}
                />
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <SkillList
                  skills={skills}
                  selectedSkillId={selectedEntityId}
                  selectedIndex={selectedIndex}
                  onSelectSkill={handleSelectEntity}
                  isLoading={skillQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : skillQuery.error}
                  {...draftListProps}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <SkillDetail skillData={selectedSkill} />
            </Grid>
          </Grid>
        );
      }

      case 'status': {
        const statuses = draft
          ? (draft.data as StatusDefinition[])
          : statusQuery.data?.data;
        const selectedStatus = selectByIndexOrId(
          statuses,
          selectedIndex,
          selectedEntityId,
          (item) => item.statusId,
        );
        const idError =
          draft && selectedStatus
            ? getIdValidationMessage(
                selectedStatus.statusId,
                collectEntityIds(statuses ?? [], 'status'),
              )
            : null;

        if (draft && selectedStatus) {
          return (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                  <StatusList
                    statuses={statuses}
                    selectedStatusId={selectedEntityId}
                    onSelectStatus={handleSelectEntity}
                    isLoading={false}
                    error={null}
                    {...draftListProps}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <StatusEditor
                  statusData={selectedStatus}
                  onUpdate={handleUpdateStatusEntity}
                  idError={idError}
                />
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <StatusList
                  statuses={statuses}
                  selectedStatusId={selectedEntityId}
                  selectedIndex={selectedIndex}
                  onSelectStatus={handleSelectEntity}
                  isLoading={statusQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : statusQuery.error}
                  {...draftListProps}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <StatusDetail statusData={selectedStatus} />
            </Grid>
          </Grid>
        );
      }

      case 'element': {
        const elements = draft
          ? (draft.data as ElementDefinition[])
          : elementQuery.data?.data;
        const selectedElement = selectByIndexOrId(
          elements,
          selectedIndex,
          selectedEntityId,
          (item) => item.elementId,
        );
        const idError =
          draft && selectedElement
            ? getIdValidationMessage(
                selectedElement.elementId,
                collectEntityIds(elements ?? [], 'element'),
              )
            : null;

        if (draft && selectedElement) {
          return (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                  <ElementList
                    elements={elements}
                    selectedElementId={selectedEntityId}
                    onSelectElement={handleSelectEntity}
                    isLoading={false}
                    error={null}
                    {...draftListProps}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ElementEditor
                  elementData={selectedElement}
                  onUpdate={handleUpdateElementEntity}
                  idError={idError}
                />
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ElementList
                  elements={elements}
                  selectedElementId={selectedEntityId}
                  selectedIndex={selectedIndex}
                  onSelectElement={handleSelectEntity}
                  isLoading={elementQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : elementQuery.error}
                  {...draftListProps}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ElementDetail elementData={selectedElement} />
            </Grid>
          </Grid>
        );
      }

      case 'resonance': {
        const resonances = draft
          ? (draft.data as ResonanceDefinition[])
          : resonanceQuery.data?.data;
        const selectedResonance = selectByIndexOrId(
          resonances,
          selectedIndex,
          selectedEntityId,
          (item) => item.resonanceId,
        );
        const idError =
          draft && selectedResonance
            ? getIdValidationMessage(
                selectedResonance.resonanceId,
                collectEntityIds(resonances ?? [], 'resonance'),
              )
            : null;

        if (draft && selectedResonance) {
          return (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                  <ResonanceList
                    resonances={resonances}
                    selectedResonanceId={selectedEntityId}
                    onSelectResonance={handleSelectEntity}
                    isLoading={false}
                    error={null}
                    {...draftListProps}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ResonanceEditor
                  resonanceData={selectedResonance}
                  onUpdate={handleUpdateResonanceEntity}
                  idError={idError}
                />
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ResonanceList
                  resonances={resonances}
                  selectedResonanceId={selectedEntityId}
                  selectedIndex={selectedIndex}
                  onSelectResonance={handleSelectEntity}
                  isLoading={resonanceQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : resonanceQuery.error}
                  {...draftListProps}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ResonanceDetail resonanceData={selectedResonance} />
            </Grid>
          </Grid>
        );
      }

      case 'combat-constants': {
        const data = draft
          ? (draft.data as CombatConstantsData)
          : combatConstantsQuery.data?.data;

        if (draft && data) {
          return (
            <CombatConstantsEditor data={data} onUpdate={handleUpdateCombatConstants} />
          );
        }

        return (
          <CombatConstantsDetail
            data={data}
            isLoading={combatConstantsQuery.isPending && currentVersion !== null}
            error={combatConstantsQuery.error}
          />
        );
      }
    }
  };

  const originalData = getOriginalData();

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Catalog
      </Typography>

      <CatalogTypeNav selectedType={selectedType} onTypeChange={handleTypeChange} />

      <Box sx={{ mb: 3 }}>
        <VersionPicker
          catalogType={selectedType}
          versions={allVersions}
          selectedVersion={currentVersion}
          onVersionChange={(version) => handleVersionChange(selectedType, version)}
          isLoading={versionsLoading}
          error={versionsError}
          disabled={draft !== null}
        />
        {currentVersion !== null && !draft && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Viewing version {currentVersion}
          </Typography>
        )}
      </Box>

      {currentVersion !== null && (
        <DraftToolbar
          catalogType={selectedType}
          currentVersion={currentVersion}
          hasDraft={draft !== null}
          isDraftDirty={draft?.isDirty ?? false}
          draftSourceVersion={draft?.sourceVersion ?? null}
          onCreateDraft={handleCreateDraft}
          onDiscardDraft={handleDiscardDraft}
          onOpenPublish={handleOpenPublish}
          isCreatingDraft={false}
          hasValidationErrors={hasInvalidIds}
        />
      )}

      {currentVersion === null ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a version above to browse catalog entities.
          </Typography>
        </Paper>
      ) : (
        renderEntityContent()
      )}

      {draft && originalData && (
        <PublishDialog
          open={publishDialogOpen}
          onClose={handleClosePublish}
          onPublish={handlePublish}
          catalogType={selectedType}
          sourceVersion={draft.sourceVersion}
          originalData={originalData}
          draftData={draft.data}
          isPending={isPublishing}
          error={publishError}
          isConflictError={isConflictError}
          isAuthError={isAuthError}
          hasValidationErrors={hasInvalidIds}
        />
      )}

      {pendingDelete && (
        <ConfirmDeleteDialog
          open
          title={`Delete ${pendingDelete.kindLabel}?`}
          description={`Delete "${pendingDelete.displayName || 'this entry'}" from this draft? This only affects the working copy.`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      <Snackbar
        open={successSnackbar !== null}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {successSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
