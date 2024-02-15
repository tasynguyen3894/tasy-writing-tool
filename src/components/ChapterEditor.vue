<template>
  <div :class="{'full-screen-container': isFullScreen}">
    <div v-if="props.label">
      <div class="text-h6">{{ props.label }}</div>
    </div>
    <div>
      <q-btn icon="add" @click="startToEdit()" />
      <q-btn-group :key="index" v-for="(group, index) in props.toolbars">
        <template :key="toolbar" v-for="toolbar in group">
          <q-btn v-bind="btnBind(toolbar)" @click="format(toolbar)" />
        </template>
      </q-btn-group>
      <q-btn style="float: right;" :icon="isFullScreen ? 'fullscreen_exit' : 'fullscreen'" @click="toggleFullScreen()" />
      <div>
        <q-chip
          v-for="variable in savedVariables"
          :key="variable.key"
          removable
          clickable
          @click="addSavedVariable(variable.key)"
          @remove="removeSavedVariable(variable.key)"
          flat
        >{{ variable.label }}</q-chip>
      </div>
    </div>
    
    <div
      ref="editorRawRef"
      @input="changeHtml"
      @paste="handlePaste"
      class="editor"
      contenteditable="true">
    </div>
    <div v-if="props.wordCount">
      <i>{{ t('chapter.editor.letter') }}: {{ numberOfWord.letters }}, {{ t('chapter.editor.word') }}: {{ numberOfWord.words }}</i>
    </div>
  </div>
  <q-dialog v-model="isShowCharacter">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ t('chapter.editor.add_variable') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          v-model="variableType"
          :options="variableOptions"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          :label="t('chapter.editor.variable_type')"
        />
        <q-select
          v-if="variableType"
          v-model="variableSelected"
          :options="variableType === VariableType.character ? props.characters : props.objects"
          :label="variableType === VariableType.character ? t('common.character') : t('common.object')"
          option-label="name"
        />
        <template v-if="variableSelected">
          <q-select
            :label="t('character.character_extra')"
            v-model="metaSelected"
            :options="metaOptions"
            option-value="value"
          >
            <template v-slot:append>
              <q-btn @click="saveVariable()" flat icon="push_pin" />
            </template>
          </q-select>
        </template>
      </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat :label="t('common.form.cancel')" v-close-popup />
      <q-btn flat :label="t('common.form.add')" v-close-popup @click="selectVariable()" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';

import { VariableAttribute } from 'src/util/helper';
import { findVariableValue, VariableType, parseHTMLString } from 'src/util/editor';

export type Formatter = 'bold' | 'italic' | 'underline' | 'strikeThrough' 
| 'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull' 
| 'insertUnorderedList' | 'insertOrderedList' | 'subscript' | 'superscript';

export interface VariableMeta {
  key: string,
  value: string
}

export interface Variable {
  id: string,
  alias: string,
  name: string,
  metas: VariableMeta[]
}
export type Toolbar = Array<Formatter[]>;

export interface ToolbarConfig {
  [key: string]: {
    label?: string;
    icon?: string;
  }
}

export interface SavedVariable {
  key: string,
  label: string
}

export interface WordCount {
  letters: number,
  words: number
} 

export interface ChapterEditorProps {
  modelValue: string,
  characters: Variable[],
  objects: Variable[],
  toolbars?: Toolbar,
  label?: string,
  wordCount?: boolean
}

const toolbarConfig: ToolbarConfig = {
  bold: {
    icon: 'format_bold'
  },
  italic: {
    icon: 'format_italic'
  },
  underline: {
    icon: 'format_underline'
  },
  strikeThrough: {
    icon: 'strikethrough_s'
  },
  justifyLeft: {
    icon: 'format_align_left'
  },
  justifyCenter: {
    icon: 'format_align_center'
  },
  justifyRight: {
    icon: 'format_align_right'
  },
  justifyFull: {
    icon: 'format_align_justify'
  },
  insertUnorderedList: {
    icon: 'format_align_justify'
  },
  insertOrderedList: {
    icon: 'lists'
  },
  subscript: {
    icon: 'subscript'
  },
  superscript: {
    icon: 'superscript'
  },
}

const props = withDefaults(defineProps<ChapterEditorProps>(), {
  modelValue: '<div>Type somethings</div>',
  characters: () => [],
  objects: () => [],
  toolbars: () => [],
  wordCount: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const { t } = useI18n();

const editor = ref<string>('');
const editorRawRef = ref<HTMLElement | null>(null);
const isShowCharacter = ref<boolean>(false);
const currentRange = ref<Range | null>(null);
const variableType = ref<string>();
const variableSelected = ref<Variable | undefined>(undefined);
const metaSelected = ref<{ label: string, value: string } | undefined>(undefined);
const savedVariables = ref<SavedVariable[]>([]);
const numberOfWord = ref<WordCount>({ letters: 0, words: 0 });
const isFullScreen = ref<boolean>(false);

const metaOptions = computed<{ label: string, value: string }[]>(() => {
  if(variableSelected.value) {
    return variableSelected.value.metas.map(({ key, value }) => {
      return {
        label: key + ': ' + value,
        value: key
      }
    })
  }
  return [];
});

const variableOptions = computed<{ label: string, value: string }[]>(() => {
  return [
    {
      label: t('common.character'),
      value: VariableType.character
    },
    {
      label: t('common.object'),
      value: VariableType.object
    }
  ]
})

watch(variableSelected, () => {
  if(variableSelected.value) {
    metaSelected.value = undefined;
  }
});

watch(editor, () => {
  emits('update:modelValue', convertEditorContent(editor.value));
});

watch(editorRawRef, () => {
  if(editorRawRef.value) {
    editorRawRef.value.innerHTML = formatContentFromProps(props.modelValue);
    editor.value = formatContent(editorRawRef.value.innerHTML);
    const observer = new MutationObserver((_, __) => {
      if (editorRawRef.value) {
        editor.value = formatContent(editorRawRef.value.innerHTML);
      }
    });
    observer.observe(editorRawRef.value, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }
});


watch(() => props.modelValue, () => {
  if(editorRawRef.value && props.modelValue != editor.value) {
    editorRawRef.value.innerHTML = formatContentFromProps(props.modelValue);
  }
});

watch(variableType, () => {
  variableSelected.value = undefined;
});

watch(editor, () => {
  numberOfWord.value = getNumberOfWord();
});

function getNumberOfWord(): WordCount {
  if(editorRawRef.value && editor.value) {
    let baseText = editorRawRef.value.textContent;
    if(baseText) {
      let letters = baseText.length;
      let words = baseText.split(' ').filter(word => word.length > 0).length;

      const doc = parseHTMLString(editorRawRef.value.innerHTML);
      doc.body.querySelectorAll(`[${VariableAttribute.content}]`).forEach(node => {
        const content = node.getAttribute(VariableAttribute.content);
        if(content) {
          letters += content.length;
          words += content.split(' ').filter(word => word.length > 0).length
        }
      });
      return {
        words,
        letters
      }
    }
  }
  return {
    words: 0,
    letters: 0
  }
}


function handlePaste(e: ClipboardEvent) {
  if(e.clipboardData) {
    e.preventDefault();
    const doc = parseHTMLString(e.clipboardData.getData('text/html'));
    doc.querySelectorAll('body *').forEach(node => {
      for (let i = 0; i < node.attributes.length; i++) {
        if(!([VariableAttribute.content, VariableAttribute.variable] as string[]).includes(node.attributes[i].name)) {
          node.removeAttribute(node.attributes[i].name);
        }
      }
    });
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return;
    }
    selection.deleteFromDocument();
    const pasteRange = selection.getRangeAt(0);
    const nodeList: ChildNode[] = [];
    doc.body.childNodes.forEach(node => {
      nodeList.push(node);
    })
    nodeList.reverse().forEach(node => {
      pasteRange.insertNode(node)
    })
    selection.collapseToEnd();
  }
}

function formatContent(content: string): string {
  const doc = parseHTMLString(content);
  doc.body.querySelectorAll(`[${VariableAttribute.content}]`).forEach(node => {
    node.removeAttribute(VariableAttribute.content);
  });
  return doc.body.innerHTML;
}

function formatContentFromProps(content: string): string {
  const doc = parseHTMLString(content);
  doc.body.querySelectorAll(`[${VariableAttribute.variable}]`).forEach(node => {
    const variable = node.getAttribute(VariableAttribute.variable);
    if(variable != null) {
      node.setAttribute(VariableAttribute.content, findVariable(variable));
    }
  });
  return doc.body.innerHTML;
}

function convertEditorContent(content: string): string {
  const doc = parseHTMLString(content);
  doc.body.querySelectorAll(`[${VariableAttribute.content}]`).forEach(node => {
    node.removeAttribute(VariableAttribute.content);
  });
  return content;
}

function saveVariable() {
  if(variableSelected.value) {
    const variables = [
      variableType.value === VariableType.character ? 'character' : 'object',
      variableSelected.value.id
    ];
    if(metaSelected.value) {
      variables.push('meta');
      variables.push(metaSelected.value.value);
    }
    const variableKey = variables.join('.');
    if(!savedVariables.value.some(({ key }) => key === variableKey)) {
      savedVariables.value.push({
        key: variableKey,
        label: findVariable(variableKey)
      })
    }
  }
}

function btnBind(type: Formatter) {
  if(toolbarConfig[type]) {
    const toolbarProps = toolbarConfig[type];
    if(toolbarProps.icon) {
      return {
        icon: toolbarProps.icon
      }
    }
    return {
      label: toolbarProps.label || ''
    }
  } else {
    return {
      label: type
    }
  }
}

function format(type: Formatter) {
  document.execCommand(type, false);
}

function startToEdit() {
  const sel = window.getSelection();
  if(sel) {
    currentRange.value = sel.getRangeAt(0);
  }
  isShowCharacter.value = true;
}

function changeHtml(e: Event) {
  if (e.target instanceof Element) {
    editor.value = e.target.innerHTML;
  }
}

function selectVariable() {
  if(variableSelected.value) {
    const variables = [
      variableType.value === VariableType.character ? 'character' : 'object',
      variableSelected.value.id
    ];
    if(metaSelected.value) {
      variables.push('meta');
      variables.push(metaSelected.value.value);
    }
    addVariable(variables.join('.'));
  }
}

function addSavedVariable(variable: string) {
  const sel = window.getSelection();
  if(sel) {
    currentRange.value = sel.getRangeAt(0);
  }
  addVariable(variable);
}

function removeSavedVariable(variable: string) {
  savedVariables.value = savedVariables.value.filter(({ key }) => key !== variable);
}

function addVariable(variable: string) {
  const edit = editorRawRef.value;
  const name = findVariable(variable);
  const selection = window.getSelection();
  if(edit && currentRange.value && selection) {
    currentRange.value.deleteContents();
    const textNode = document.createTextNode('\u00a0');
    const element = document.createElement('span');
    element.innerHTML = '';
    element.setAttribute(VariableAttribute.variable, variable);
    element.setAttribute(VariableAttribute.content, name);
    currentRange.value.insertNode(textNode);
    currentRange.value.insertNode(element);
    currentRange.value.setStartAfter(textNode);
    
    selection.removeAllRanges();
    selection.addRange(currentRange.value);
  }
}

function findVariable(variable: string): string {
  return findVariableValue(props.characters, props.objects, variable);
}

function toggleFullScreen() {
  isFullScreen.value = !isFullScreen.value;
}
</script>
<style lang="scss" scoped>
:deep([data-variable]) {
  border: 1px solid #333;
  padding: 3px;
  display: inline-block;
}
:deep([data-content]) {
  &::before {
    content: attr(data-content)
  }
}

.editor {
  border: 1px solid #333;
  min-height: 100px;
  max-height: 300px;
  overflow-y: scroll; 
  overflow: auto;
  padding: 10px;
}

.full-screen-container {
  position: fixed;
  top: 0;
  width: 100%;
  background: #FFF;
  z-index: 9999;
  left: 0;
  height: 100vh;
  .editor {
    max-height: calc(100vh - 100px);
  }
}
</style>