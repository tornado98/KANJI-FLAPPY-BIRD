import os
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Baby Seal Kanji Diver - Pro Modular Edition",
    page_icon="🦭",
    layout="wide"
)

st.title("🦭 Baby Seal Kanji Diver: Pro Modular Edition")

def load_game():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(current_dir, "static")

    # 1. Load Stylesheet
    with open(os.path.join(static_dir, "style.css"), "r", encoding="utf-8") as f:
        css_content = f.read()

    # 2. Load Core Config, Audio & JLPT Database
    with open(os.path.join(static_dir, "js", "constants.js"), "r", encoding="utf-8") as f:
        constants_js = f.read()
    with open(os.path.join(static_dir, "js", "audio.js"), "r", encoding="utf-8") as f:
        audio_js = f.read()
    with open(os.path.join(static_dir, "js", "database.js"), "r", encoding="utf-8") as f:
        database_js = f.read()

    # 3. Load Modular Character Entities
    char_dir = os.path.join(static_dir, "js", "characters")
    with open(os.path.join(char_dir, "base_entity.js"), "r", encoding="utf-8") as f:
        base_entity_js = f.read()
    with open(os.path.join(char_dir, "seal.js"), "r", encoding="utf-8") as f:
        seal_js = f.read()
    with open(os.path.join(char_dir, "patrick.js"), "r", encoding="utf-8") as f:
        patrick_js = f.read()
    with open(os.path.join(char_dir, "spongebob.js"), "r", encoding="utf-8") as f:
        spongebob_js = f.read()
    with open(os.path.join(char_dir, "squidward.js"), "r", encoding="utf-8") as f:
        squidward_js = f.read()
    with open(os.path.join(char_dir, "plankton.js"), "r", encoding="utf-8") as f:
        plankton_js = f.read()
    with open(os.path.join(char_dir, "mr_krabs.js"), "r", encoding="utf-8") as f:
        mr_krabs_js = f.read()

    # 4. Load UI, Collision & Main Game Loop
    with open(os.path.join(static_dir, "js", "ui.js"), "r", encoding="utf-8") as f:
        ui_js = f.read()
    with open(os.path.join(static_dir, "js", "collision.js"), "r", encoding="utf-8") as f:
        collision_js = f.read()
    with open(os.path.join(static_dir, "js", "game.js"), "r", encoding="utf-8") as f:
        game_js = f.read()

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+JP:wght@700&display=swap" rel="stylesheet">
        <style>{css_content}</style>
    </head>
    <body>
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>

        <div id="game-container">
            <header id="game-header">
                <div class="header-left">
                    <span class="status-indicator"></span>
                    <span class="game-brand">SEAL KANJI DIVER</span>
                    <span class="badge-version">v4.0 ULTIMATE</span>
                </div>
                <div class="header-right">
                    <button id="btn-audio-toggle" class="header-btn" title="Toggle Sound">
                        <span id="audio-icon">🔊</span> AUDIO
                    </button>
                    <button id="btn-fullscreen" class="header-btn" title="Toggle Fullscreen">
                        ⛶ FULLSCREEN
                    </button>
                </div>
            </header>

            <div id="wrapper">
                <canvas id="sealCanvas" width="1180" height="720" tabindex="1"></canvas>
                <div id="instructions-overlay">
                    <div class="control-item"><span class="keycap">SPACE</span><span class="key-label">Swim</span></div>
                    <span class="divider">•</span>
                    <div class="control-item"><span class="keycap">SHIFT</span><span class="key-label">Dash</span></div>
                    <span class="divider">•</span>
                    <div class="control-item"><span class="keycap">F / R-Click</span><span class="key-label">Shoot Kanji</span></div>
                    <span class="divider">•</span>
                    <div class="control-item"><span class="keycap">ESC / P</span><span class="key-label">Pause</span></div>
                </div>
            </div>
        </div>

        <script>
            // Fullscreen Toggle Handler
            const fsBtn = document.getElementById('btn-fullscreen');
            fsBtn.addEventListener('click', () => {{
                if (!document.fullscreenElement) {{
                    document.documentElement.requestFullscreen().catch(() => {{}});
                    fsBtn.innerText = '⤓ EXIT FULLSCREEN';
                }} else {{
                    if (document.exitFullscreen) document.exitFullscreen();
                    fsBtn.innerText = '⛶ FULLSCREEN';
                }}
            }});

            // Audio Mute Handler
            const audioBtn = document.getElementById('btn-audio-toggle');
            const audioIcon = document.getElementById('audio-icon');
            let isMuted = false;
            audioBtn.addEventListener('click', () => {{
                isMuted = !isMuted;
                if (isMuted) {{
                    audioIcon.innerText = '🔇';
                    audioBtn.classList.add('muted');
                    if (typeof actx !== 'undefined' && actx && actx.state === 'running') actx.suspend();
                }} else {{
                    audioIcon.innerText = '🔊';
                    audioBtn.classList.remove('muted');
                    if (typeof actx !== 'undefined' && actx && actx.state === 'suspended') actx.resume();
                }}
            }});
        </script>

        <!-- Strict Dependency Loading Order -->
        <script>{constants_js}</script>
        <script>{audio_js}</script>
        <script>{database_js}</script>
        <script>{base_entity_js}</script>
        <script>{seal_js}</script>
        <script>{patrick_js}</script>
        <script>{spongebob_js}</script>
        <script>{squidward_js}</script>
        <script>{plankton_js}</script>
        <script>{mr_krabs_js}</script>
        <script>{ui_js}</script>
        <script>{collision_js}</script>
        <script>{game_js}</script>
    </body>
    </html>
    """

components.html(load_game(), height=840, scrolling=False)

with st.sidebar:
    st.header("🦭 Cast & Boss Rotation")
    st.markdown("""
    **Heroes & Allies:**
    - 🦭 **Baby Seal:** Soft-body physics, hydro-ripples & dash afterimages.
    - 🌟 **Patrick Star:** Summoned at 3 Fish + 100 pts. Auto-fires Kanji at bosses.
    - 🧽 **SpongeBob:** Summoned at 6 Fish. Blows rainbow soap bubbles & shield buffs.

    **Round-Robin Bosses (Every 4 Gates):**
    1. 🦑 **Squidward:** Spatula burger throws & rage steam.
    2. 🔬 **Plankton:** Jet-thruster pod & ocular laser beam.
    3. 🦀 **Mr. Krabs:** Snapping pincer claws & spinning golden `$` coins.
    """)