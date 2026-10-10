# DeepFakeShield — Model Cards

## 1. WavLM-SpoofHead (Audio Modality)
- **Base Architecture**: Microsoft WavLM-Base-Plus (12 transformer layers, 768 hidden dimension).
- **Task**: Synthetic Speech & Voice Cloning Detection.
- **Training Corpus**: ASVspoof 2019 LA, ASVspoof 2021 DF, In-the-Wild TTS.
- **Evaluation Accuracy**: 97.3% on ASVspoof 2019 LA.
- **Equal Error Rate (EER)**: 2.71%.
- **Known Limitations**: Susceptible to degradation under low-bitrate telephone compression (8kHz narrowband codecs).

## 2. FaceForensics-EfficientNet-B4 (Video Modality)
- **Base Architecture**: EfficientNet-B4 + Temporal GRU Aggregation.
- **Task**: Facial Forgery, FaceSwap & Face2Face Detection.
- **Training Corpus**: FaceForensics++ (c23 HQ subset).
- **Evaluation Accuracy**: 96.8%.
- **ROC-AUC**: 0.989.
- **Known Limitations**: Optimized for face boundaries; whole-scene generative video diffusion requires broader spatial attention.

## 3. ForensicVision-ResNet50 (Image Modality)
- **Base Architecture**: ResNet-50 Spatial Noise Extractor.
- **Task**: Generative AI Image Detection (Diffusion & GAN artifacts).
- **Training Corpus**: GenImage, DiffusionForensics, CIFAKE.
- **Evaluation Accuracy**: 95.4%.
- **Known Limitations**: Heavy JPEG compression (Q < 60) strips high-frequency sensor noise.

## 4. CrossAttention-AVFusion (Multimodal Modality)
- **Base Architecture**: Dual-Stream Transformer Cross-Attention.
- **Task**: Audio-Visual Deepfake Alignment & Discrepancy Gating.
- **Training Corpus**: FakeAVCeleb v1.2, DFDC subset.
- **Evaluation Accuracy**: 98.2%.
- **Multimodal F1**: 0.981.
- **Known Limitations**: Requires audio-visual synchronization within 200ms tolerance.
