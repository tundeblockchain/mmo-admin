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
  }, []);

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setVersions((prev) => ({ ...prev, [type]: version }));
    setSelectedEntityId(null);
  }, []);

  const handleSelectEntity = useCallback((id: string) => {
    setSelectedEntityId(id);
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
      setSuccessSnackbar(`Published ${selectedType} v${result.version}`);
    },
    [draft, selectedType, publish, discardDraft],
  );

  const handleCloseSnackbar = useCallback(() => {
    setSuccessSnackbar(null);
  }, []);

  const handleUpdateClassEntity = useCallback(
    (updated: ClassDefinition) => {
      if (!draft || selectedType !== 'class') return;
      const classes = draft.data as ClassDefinition[];
      const updatedClasses = classes.map((c) =>
        c.classId === updated.classId ? updated : c,
      );
      updateDraft('class', updatedClasses);
    },
    [draft, selectedType],
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
      if (!draft || selectedType !== 'skill') return;
      const skills = draft.data as SkillDefinition[];
      const updatedSkills = skills.map((s) =>
        s.skillId === updated.skillId ? updated : s,
      );
      updateDraft('skill', updatedSkills);
    },
    [draft, selectedType],
  );

  const handleUpdateStatusEntity = useCallback(
    (updated: StatusDefinition) => {
      if (!draft || selectedType !== 'status') return;
      const statuses = draft.data as StatusDefinition[];
      const updatedStatuses = statuses.map((s) =>
        s.statusId === updated.statusId ? updated : s,
      );
      updateDraft('status', updatedStatuses);
    },
    [draft, selectedType],
  );

  const handleUpdateElementEntity = useCallback(
    (updated: ElementDefinition) => {
      if (!draft || selectedType !== 'element') return;
      const elements = draft.data as ElementDefinition[];
      const updatedElements = elements.map((e) =>
        e.elementId === updated.elementId ? updated : e,
      );
      updateDraft('element', updatedElements);
    },
    [draft, selectedType],
  );

  const handleUpdateResonanceEntity = useCallback(
    (updated: ResonanceDefinition) => {
      if (!draft || selectedType !== 'resonance') return;
      const resonances = draft.data as ResonanceDefinition[];
      const updatedResonances = resonances.map((r) =>
        r.resonanceId === updated.resonanceId ? updated : r,
      );
      updateDraft('resonance', updatedResonances);
    },
    [draft, selectedType],
  );

  const allVersions = versionData?.versions ?? [];
  const currentVersion = versions[selectedType];

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

  const renderEntityContent = () => {
    switch (selectedType) {
      case 'class': {
        const classes = draft
          ? (draft.data as ClassDefinition[])
          : classQuery.data?.data;
        const selectedClass = classes?.find((c) => c.classId === selectedEntityId) ?? null;

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
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ClassEditor
                  classData={selectedClass}
                  onUpdate={handleUpdateClassEntity}
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
                  onSelectClass={handleSelectEntity}
                  isLoading={classQuery.isPending && currentVersion !== null}
                  error={classQuery.error}
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
        const selectedSkill = skills?.find((s) => s.skillId === selectedEntityId) ?? null;

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
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <SkillEditor
                  skillData={selectedSkill}
                  onUpdate={handleUpdateSkillEntity}
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
                  onSelectSkill={handleSelectEntity}
                  isLoading={skillQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : skillQuery.error}
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
        const selectedStatus = statuses?.find((s) => s.statusId === selectedEntityId) ?? null;

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
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <StatusEditor
                  statusData={selectedStatus}
                  onUpdate={handleUpdateStatusEntity}
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
                  onSelectStatus={handleSelectEntity}
                  isLoading={statusQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : statusQuery.error}
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
        const selectedElement = elements?.find((e) => e.elementId === selectedEntityId) ?? null;

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
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ElementEditor
                  elementData={selectedElement}
                  onUpdate={handleUpdateElementEntity}
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
                  onSelectElement={handleSelectEntity}
                  isLoading={elementQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : elementQuery.error}
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
        const selectedResonance =
          resonances?.find((r) => r.resonanceId === selectedEntityId) ?? null;

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
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ResonanceEditor
                  resonanceData={selectedResonance}
                  onUpdate={handleUpdateResonanceEntity}
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
                  onSelectResonance={handleSelectEntity}
                  isLoading={resonanceQuery.isPending && currentVersion !== null && !draft}
                  error={draft ? null : resonanceQuery.error}
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
