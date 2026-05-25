<template>
  <div class="lego-loader-overlay">
    <div class="lego-loader">
      <div class="lego-blocks">
        <div class="block block-1"></div>
        <div class="block block-2"></div>
        <div class="block block-3"></div>
        <div class="block block-4"></div>
      </div>
      <div class="typewriter">
        <h1 class="text">学生信息管理系统</h1>
        <span class="cursor"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lego-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-main);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.lego-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.lego-blocks {
  position: relative;
  width: 100px;
  height: 100px;
  transform: scale(1.2);
}

.block {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  animation: move 2.4s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.block-1 {
  background-color: var(--md-primary);
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.block-2 {
  background-color: var(--md-secondary);
  top: 0;
  right: 0;
  animation-delay: 0.6s;
}

.block-3 {
  background-color: #00897b;
  bottom: 0;
  right: 0;
  animation-delay: 1.2s;
}

.block-4 {
  background-color: #ffb300;
  bottom: 0;
  left: 0;
  animation-delay: 1.8s;
}

@keyframes move {
  0%, 100% { transform: translate(0, 0); z-index: 1; }
  25% { transform: translate(56px, 0); z-index: 2; }
  50% { transform: translate(56px, 56px); z-index: 1; }
  75% { transform: translate(0, 56px); z-index: 2; }
}

/* 精细化打字机与光标效果 */
.typewriter {
  display: flex;
  align-items: center;
}

.text {
  color: var(--text-primary);
  font-family: 'PingFang SC', 'SF Pro Display', sans-serif;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 2px;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  margin: 0; /* 移除默认外边距 */
  line-height: 1.4; /* 增加行高，防止下半部分被截断 */
  padding-bottom: 4px; /* 预留底部空间 */
  animation: typing 3.5s steps(10, end) forwards;
  max-width: max-content;
}

.cursor {
  display: inline-block;
  width: 3px;
  height: 32px;
  background-color: var(--md-primary);
  margin-left: 8px;
  flex-shrink: 0; /* 防止光标被挤压 */
  animation: blink 0.8s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; } /* 使用 100% 配合 flex 容器自动展开 */
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
