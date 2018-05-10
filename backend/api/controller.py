import os
import sys
import glob

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(1, os.path.join(CURRENT_PATH, "ecg"))
from cardio import dataset as ds
from cardio import EcgDataset
from cardio.pipelines import dirichlet_predict_pipeline, hmm_predict_pipeline
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"


class EcgController:
    def __init__(self, ecg_path, dirichlet_path, hmm_path):
        if isinstance(ecg_path, str):
            ecg_path = [ecg_path]
        paths = []
        for path in ecg_path:
            paths.extend(p for p in glob.glob(path, recursive=True) if os.path.isfile(p))
        paths = sorted(paths)
        if not paths:
            raise ValueError("A list of ECG signals can not be empty")
        key_len = len(str(len(paths)))
        self.ecg_dict = {str(i + 1).zfill(key_len): f for i, f in enumerate(paths)}

        BATCH_SIZE = 1
        self.ppl_load_signal = (
            ds.Pipeline()
              .load(fmt='wfdb', components=["signal", "meta"])
              .flip_signals()
              .run(batch_size=BATCH_SIZE, shuffle=False, drop_last=False, n_epochs=1, lazy=True)
        )
        self.ppl_predict_af = dirichlet_predict_pipeline(dirichlet_path, batch_size=BATCH_SIZE)
        self.ppl_predict_states = hmm_predict_pipeline(hmm_path, batch_size=BATCH_SIZE)

    def build_ds(self, data):
        ecg_id = data.get("id")
        ecg_path = self.ecg_dict.get(ecg_id)
        if ecg_id is None or ecg_path is None:
            raise ValueError("Invalid ecg name")
        eds = EcgDataset(path=ecg_path, no_ext=True, sort=True)
        return eds

    def get_list(self, data, meta):
        ecg_list = [{"id": k} for k in sorted(self.ecg_dict)]
        return dict(data=ecg_list, meta=meta)

    def get_item_data(self, data, meta):
        eds = self.build_ds(data)
        batch = (eds >> self.ppl_load_signal).next_batch()
        data["signal"] = batch.signal[0].ravel().tolist()
        data["frequency"] = batch.meta[0]["fs"]
        data["units"] = batch.meta[0]["units"][0]
        return dict(data=data, meta=meta)

    def get_inference(self, data, meta):
        eds = self.build_ds(data)
        batch = (eds >> self.ppl_predict_states).next_batch()
        signal_meta = batch.meta[0]
        inference = {
            "heart_rate": signal_meta["hr"],
            "qrs_interval": signal_meta["qrs"],
            "qt_interval": signal_meta["qt"],
            "pq_interval": signal_meta["pq"],
            "p_segments": signal_meta["p_segments"].tolist(),
            "t_segments": signal_meta["t_segments"].tolist(),
            "qrs_segments": signal_meta["qrs_segments"].tolist(),
        }
        ppl_predict_af = (eds >> self.ppl_predict_af).run()
        inference["af_prob"] = float(ppl_predict_af.get_variable("predictions_list")[0]["target_pred"]["A"])
        data["inference"] = inference
        return dict(data=data, meta=meta)
